<script>
  import { ctx } from "./stores.js"

  const togglePlay = async () => {
    if ($ctx.state === 'suspended') {
      await $ctx.resume();
    } else {
      await $ctx.suspend();
    }
  }
</script>

<button on:click={togglePlay}>Play</button>

<style>
    button {
        padding: 1rem;
        width: 100%;
        margin-bottom: 1rem;
    }
</style>
