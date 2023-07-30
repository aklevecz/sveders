import fs from "fs";
import path from "path";

const shadersPath = "./src/lib/shaders"; // Path to the shaders directory
const outputFolderPath = "./src/lib/shaders-js"; // Path to the output folder

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Get a list of subdirectories in the shaders directory
const shaderDirectories = fs
  .readdirSync(shadersPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Iterate through each shader directory
shaderDirectories.forEach((directoryName) => {
  const shaderFolderPath = path.join(shadersPath, directoryName);
  const fragmentFilePath = path.join(shaderFolderPath, "fragment.glsl");

  // Check if the fragment.glsl file exists
  if (fs.existsSync(fragmentFilePath)) {
    // Read the contents of the fragment.glsl file
    const fragmentCode = fs.readFileSync(fragmentFilePath, "utf8");

    // Create a new folder for the shader
    const shaderOutputFolderPath = path.join(outputFolderPath, directoryName);
    fs.mkdirSync(shaderOutputFolderPath);

    // Create the JavaScript file for the shader
    const shaderOutputFilePath = path.join(shaderOutputFolderPath, "fragment.js");
    const shaderCode = `export default /* glsl */ \`${fragmentCode}\`;`;

    // Write the shader code to the JavaScript file
    fs.writeFileSync(shaderOutputFilePath, shaderCode);

    console.log(`Created fragment.js for ${directoryName}`);
  }
});
