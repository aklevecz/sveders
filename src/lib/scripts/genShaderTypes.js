import fs from "fs";
import _ from "lodash";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const NOT_WORKING = ["flow", "neurons"];

const __dirname = dirname(fileURLToPath(import.meta.url));
let shaders = fs.readdirSync(resolve(__dirname, "../shaders"));

shaders = shaders.filter((s) => !s.includes(".js")).filter((s) => !NOT_WORKING.includes(s));

// shaders.d.js
let outString = `/**
    * @typedef  {(${shaders.map((s) => `'${s}'`).join("|")})} Shaders
    */
   
   /** @type {Shaders} */
   export default ""; 

   `;

fs.writeFileSync(resolve(__dirname, "../types/shaders.d.js"), outString);

// shaders.js
//export const allShaders= [${shaders.map((s) => `"${s}"`).join(",")}]

let outConstants = `   
${shaders
  .map((shader) => {
    return `export { default as ${shader} } from "$shaders/${shader}/fragment.js"`;
  })
  .join("\r\n")}

  /*
  ${shaders.map((shader) => `* ${shader}`).join("\r\n")}
  */
`;

fs.writeFileSync(resolve(__dirname, "../shaders.js"), outConstants);

let genShaderComponentTemplate = (fragmentShader) => `<script>
import { Shaders, Dims } from "$types";
import Scene from "$components/Scene.svelte";
import vertexShader from "$shaders/vertex.js";
import fragmentShader from "$shaders/${fragmentShader}/fragment.js"

/** @type {Dims} */
export let dims = {width:0, height:0}
const { width, height } = dims;
</script>

<Scene {width} {height} {vertexShader} fragmentShader={fragmentShader} />`;

let shaderComponentExports = [];
for (const shader of shaders) {
  const shaderComponent = genShaderComponentTemplate(shader);
  fs.writeFileSync(resolve(__dirname, `../components/shaders/${_.startCase(shader)}.svelte`), shaderComponent);
  shaderComponentExports.push(
    `export {default as ${_.startCase(shader)}} from "./components/shaders/${_.startCase(shader)}.svelte"`
  );
}

let shaderComponentExportsString = `
${shaderComponentExports.join("\r\n")}

/**
   ${shaders.map((shader) => `* <${_.startCase(shader)}/>`).join("\r\n")}
 */
`;

fs.writeFileSync(resolve(__dirname, "../components.js"), shaderComponentExportsString);
