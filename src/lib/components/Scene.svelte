<script>
  import { afterUpdate, beforeUpdate, onDestroy } from "svelte";
  import {
    Mesh,
    Scene,
    OrthographicCamera,
    WebGLRenderer,
    ShaderMaterial,
    BufferGeometry,
    Vector2,
    BufferAttribute,
  } from "three";

  /** @type {HTMLCanvasElement}*/
  let canvas;
  export let vertexShader;
  export let fragmentShader;
  export let width;
  export let height;
  let frame;

  function initScene() {
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ canvas, alpha: true });
    if (!width && !height) {
      const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
      width = canvasWidth;
      height = canvasHeight;
    }

    renderer.setClearColor(0xff0000, 0); // not doing anything seemingly
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    const geometry = new BufferGeometry();

    // Define the vertices of the plane
    const vertices = new Float32Array([
      -1,
      -1,
      0, // Vertex 1
      1,
      -1,
      0, // Vertex 2
      -1,
      1,
      0, // Vertex 3
      1,
      1,
      0, // Vertex 4
    ]);

    // Define the UV coordinates
    const uvs = new Float32Array([
      0,
      0, // Vertex 1
      1,
      0, // Vertex 2
      0,
      1, // Vertex 3
      1,
      1, // Vertex 4
    ]);

    // Define the indices that define the triangles
    const indices = new Uint32Array([
      0,
      1,
      2, // Triangle 1
      2,
      1,
      3, // Triangle 2
    ]);

    // Set the vertices, UV coordinates, and indices to the BufferGeometry
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
    geometry.setIndex(new BufferAttribute(indices, 1));
    const shaderMaterial = new ShaderMaterial({
      uniforms: {
        resolution: { value: new Vector2(width * devicePixelRatio, height * devicePixelRatio) },
        time: { value: 0.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const planeMesh = new Mesh(geometry, shaderMaterial);
    scene.add(planeMesh);

    if (frame) {
      cancelAnimationFrame(frame);
    }

    // @note should I access this somewhere else at a higher level?
    // or should it exist somewhere else
    function render(t) {
      shaderMaterial.uniforms.time.value += 0.01;
      frame = requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }

  beforeUpdate(() => {});

  afterUpdate(() => {
    initScene();
  });

  // onMount(() => {
  //   initScene();
  // });

  onDestroy(() => {
    if (frame) cancelAnimationFrame(frame);
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
