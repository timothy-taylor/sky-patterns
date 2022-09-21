<script>
  import { afterUpdate } from "svelte";
  import { el } from "@elemaudio/core";
  import { core } from "./stores.js"
  import { defaultScale, noteToHz } from "./utils.js";
  import * as lib from "./elem-components.js";
  import Label from "./Label.svelte";

  export let amp = .1;
  export let freq = 3;
  export let delayTime = 525;
  export let delayFb = 0.1;
  export let steps = [1, 5, 7, 8, 10];
  export let attack = 0.2;
  export let decay = 0.65;

  //
  // rerun render on any param change
  const renderChanges = () => {
    let kAmp = el.const({ key: "amp", value: amp });
    let kFreq = el.const({ key: "freq", value: freq });
    let kTime = el.const({ key: "time", value: delayTime });
    let kFb = el.const({ key: "fb", value: delayFb });
    let kAtk = el.const({ key: "attack", value: attack });
    let kDecay = el.const({ key: "decay", value: decay });
    let arp = steps.map(x => noteToHz(defaultScale[x]));

    let env = el.adsr(kAtk, kDecay, 0, 0, el.train(kFreq));
    let dry = el.mul(kAmp, env, el.cycle(el.seq2({ seq: arp }, el.train(kFreq), 0)));
    let delay = lib.delay(dry, kTime, kFb);
    let sum = el.add(dry, delay);
    $core.render(el.dcblock(sum), el.dcblock(sum))
  }

  afterUpdate(() => {
    renderChanges();
  })
</script>

<form class="flex-col">
    <Label>
        amplitude: {amp}
        <input type="range" min="0" max="1" step="0.1" bind:value={amp}>
    </Label>

    <Label>
        attack: {attack}
        <input type="range" min="0" max="3" step="0.1" bind:value={attack}>
    </Label>

    <Label>
        decay: {decay}
        <input type="range" min="0.1" max="3" step="0.1" bind:value={decay}>
    </Label>

    <Label>
        delay time: {delayTime}
        <input type="range" min="30" max="1200" step="1" bind:value={delayTime}>
    </Label>

    <Label>
        delay feedback: {delayFb}
        <input type="range" min="0" max="1" step="0.1" bind:value={delayFb}>
    </Label>

    <Label>
        sequencer speed: {freq}
        <input type="range" min="1" max="20" step="0.1" bind:value={freq}>
    </Label>

    <Label>
        5 step sequencer
        {#each steps as step, i}
            <input type="range" min="0" max={defaultScale.length} step="1" bind:value={steps[i]}>
        {/each}
    </Label>
</form>

<style>
    input {
        padding: 0.6rem;
    }
</style>
