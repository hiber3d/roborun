#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import os from "os";

const inputDir = "./input_glbs";
const outputDir = "./assets/glbs";
const gltfpackArgs = ["-tc", "-tq", "10", "-cc", "-noq", "-kn", "-km"];
const gltfpackPath =
  os.platform() === "win32"
    ? "./build_scripts/gltfpack.exe"
    : "./build_scripts/gltfpack";

/**
 * Recursively find .glb files in 'dir' and convert them with gltfpack.
 * @param {string} dir
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".glb")) {
      // Construct relative path from inputDir -> file
      const relativePath = path.relative(inputDir, fullPath);
      // Construct output path
      const outPath = path.join(outputDir, relativePath);

      // Ensure output folder exists
      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      // Run gltfpack: gltfpack -i <input> -tc -tq 10 -cc -noq -o <output>
      execFileSync(
        gltfpackPath,
        ["-i", fullPath, ...gltfpackArgs, "-o", outPath],
        { stdio: "inherit" }
      );
      console.log(`Converted: ${fullPath} -> ${outPath}`);
    }
  }
}

// Start processing
processDirectory(inputDir);
console.log("All .glb files have been processed.");
