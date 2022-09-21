<script>
  import { weatherAPI } from "./stores.js";
  import Sequencer from "./Sequencer.svelte";

  let newData = {}
  let zip = "";
  const handleSubmit = async (e) => {
    e.preventDefault();

    await weatherAPI.fetch(zip);
    console.log($weatherAPI);
    newData.atk = 1 / ($weatherAPI.data.main.temp / 68) * 2;
    newData.freq = $weatherAPI.data.wind.speed / 10;
    newData.decay = $weatherAPI.data.main.humidity / 20;
    newData.steps = $weatherAPI.data.sys.sunrise.toString().split("").map(x => parseInt(x));
    newData.delayTime = $weatherAPI.data.main.pressure / 2;
    zip = "";
  }
</script>

<form on:submit={handleSubmit}>
    <label>
        enter zipcode
        <input bind:value={zip} type="text">
    </label>
    <button type="submit">get it</button>
</form>
{#if $weatherAPI.data}
    <Sequencer
        amp={0.1} freq={newData.freq} attack={newData.atk} decay={newData.decay}
        steps={newData.steps}
        delayTime={newData.delayTime}
    />
{/if}

<style>
    button {
        padding: 1rem;
    }
</style>

