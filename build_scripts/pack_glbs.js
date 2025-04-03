#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import util from "util";
import os from "os";
const execFileAsync = util.promisify(execFile);

const inputDir = "./input_glbs";
const outputDir = "./assets/glbs";
const gltfpackArgs = ["-tc", "-tq", "10", "-cc", "-noq", "-kn", "-km"];
const gltfpackPath =
  os.platform() === "win32"
    ? "./build_scripts/gltfpack.exe"
    : "./build_scripts/gltfpack";

// Concurrency limit (how many parallel conversions you want at once):
const CONCURRENCY_LIMIT = 5;

/**
 * Recursively gather all .glb file paths inside a directory.
 */
function findAllGlbFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findAllGlbFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".glb")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Convert a single .glb file with gltfpack (async).
 */
async function convertGlbFile(inputFile) {
  // Determine output path by mirroring folder structure
  const relativePath = path.relative(inputDir, inputFile);
  const outPath = path.join(outputDir, relativePath);

  // Ensure output directory structure exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Example command:
  //   gltfpack -i <inputFile> -tc -tq 10 -cc -noq -o <outPath>
  const args = ["-i", inputFile, ...gltfpackArgs, "-o", outPath];

  // Run gltfpack asynchronously
  try {
    await execFileAsync(gltfpackPath, args);
    console.log(`Converted: ${inputFile} -> ${outPath}`);
  } catch (err) {
    console.error(`Error converting ${inputFile}:`, err);
    throw err;
  }
}

/**
 * A simple "promise pool" to limit concurrency.
 * Takes an array of items and a function that returns a Promise.
 */
async function processInBatches(items, workerFn, concurrency) {
  const results = [];
  let idx = 0;

  // Array of "active" promises, up to the concurrency limit
  const pool = new Array(concurrency).fill(Promise.resolve());

  for (const item of items) {
    // When any promise in the pool finishes, replace it with a new one
    const p = pool[idx % concurrency].then(() => workerFn(item));
    pool[idx % concurrency] = p;
    results.push(p);
    idx++;
  }

  // Wait for all tasks to finish
  await Promise.all(results);
}

// Main execution:
(async () => {
  try {
    const glbFiles = findAllGlbFiles(inputDir);

    if (glbFiles.length === 0) {
      console.log(`No .glb files found in ${inputDir}. Exiting.`);
      return;
    }
    console.log(`Found ${glbFiles.length} .glb files. Converting...`);

    await processInBatches(glbFiles, convertGlbFile, CONCURRENCY_LIMIT);

    console.log("All .glb files processed successfully.");
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
})();