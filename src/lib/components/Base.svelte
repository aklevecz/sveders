<script>
  import { Shaders } from "$lib"
  import { Dims } from "$types";
  import Scene from "$components/Scene.svelte";
  import vertexShader from "$shaders/vertex.js";
  /** @type {string}*/
  export let shader;

  /** @type {Dims} */
  export let dims = {width:0, height:0};
  const { width, height } = dims;
</script>

<Scene {width} {height} {vertexShader} fragmentShader={shader} />
