import { el } from "@elemaudio/core";

export const delay = (dry, time = 250, fb = 0.0) =>
  el.delay({ size: 3 * 44100 }, el.ms2samps(time), fb, dry);
