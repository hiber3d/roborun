#!/usr/bin/env bash

# Directory that contains glTF files
INPUT_DIR="input_glbs"

# Output directory
OUTPUT_DIR="assets/glbs"

# Run find on all *.glb files
find "$INPUT_DIR" -type f -name "*.glb" | while read -r file; do

    # Construct the output path by trimming off the INPUT_DIR and prefixing OUTPUT_DIR
    # For example, if file == assets/input_glbs/folderA/scene.glb
    # then out == assets/glbs/folderA/scene.glb
    relative="${file#${INPUT_DIR}/}"
    out="${OUTPUT_DIR}/${relative}"

    # Make sure the output folder exists
    mkdir -p "$(dirname "$out")"

    # Run gltfpack with desired arguments
    ./build_scripts/gltfpack -i "$file" -tc -tq 10 -cc -noq -o "$out"

    echo "Converted: $file -> $out"
done

echo "All .glb files have been processed."
