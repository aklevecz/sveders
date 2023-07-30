<script>
  import { Base, Shaders } from "$lib";
</script>

<div class="container">
  {#each Object.keys(Shaders) as shader}
    <div class="gl_view_container">
      <div class="shader-name">{shader}</div>
      <Base shader={Shaders[shader]} />
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .gl_view_container {
    width: 300px;
    height: 300px;
    background-color: black;
    position: relative;
  }
  .shader-name {
    position: absolute;
    z-index: 9;
    color: white;
    font-size: 2.5rem;
    padding: 10px 16px;
    font-family: sans-serif;
    mix-blend-mode: difference;
  }
</style>
