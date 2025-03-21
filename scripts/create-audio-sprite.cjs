const audiosprite = require('audiosprite');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node script.js <name> <inputFolder>');
  console.error('Example: node script.js fx ./public/audio/source');
  process.exit(1);
}

const [name, inputFolder] = args;

const inputFiles = [path.join(inputFolder, '*.mp3')];
const jsonOutput = path.join('./web/audio', `${name}.json`);
const spriteFolder = path.join(inputFolder, 'sprite');
const mp3Output = path.join(spriteFolder, name);

const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDirectory(inputFolder);
ensureDirectory(spriteFolder);
ensureDirectory('./src/audio');

const opts = {
  output: mp3Output,
  format: 'howler',
};

audiosprite(
  inputFiles,
  opts,
  (err, obj) => {
    if (err) {
      console.error('Error generating audio sprite:', err);
      return;
    }

    fs.writeFileSync(jsonOutput, JSON.stringify(obj, null, 2));
  },
  { bitrate: 128 }
);

console.log(`🔊 Audio sprite "${name}" created from ${inputFolder} 🔊`);
