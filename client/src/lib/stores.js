import axios from "axios";
import { writable } from "svelte/store";
import { readable } from "svelte/store";
import WebRenderer from '@elemaudio/web-renderer';

const context = new AudioContext();
const renderer = new WebRenderer();

(async () => {
  let node = await renderer.initialize(context, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(context.destination);
})();

export const core = readable(renderer);
export const ctx = readable(context);

//
// preload cache from response for testing
const cache = {
  "06795": {
    coord: { lon: -73.1221, lat: 41.6057 },
    weather: [
      { id: 500, main: "Rain", description: "light rain", icon: "10n" },
    ],
    base: "stations",
    main: {
      temp: 65.91,
      feels_like: 65.77,
      temp_min: 62.56,
      temp_max: 70.47,
      pressure: 1013,
      humidity: 76,
    },
    visibility: 10000,
    wind: { speed: 4, deg: 50, gust: 21 },
    rain: { "1h": 0.26 },
    clouds: { all: 100 },
    dt: 1663715333,
    sys: {
      type: 2,
      id: 2034858,
      country: "US",
      sunrise: 1663670271,
      sunset: 1663714446,
    },
    timezone: -14400,
    id: 0,
    name: "Watertown",
    cod: 200,
  },
};

function createApiStore() {
  const { subscribe, set, update } = writable({ data: null, errors: null });

  const fetch = async (zip) => {
    if (cache[zip]) {
      set({ data: cache[zip], errors: null });
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${
        import.meta.env.VITE_API_KEY
      }`;
      const { data } = await axios.get(url);

      cache[zip] = data;
      update((s) => ({ ...s, data, errors: null }));
    } catch (errors) {
      update((s) => ({ ...s, errors, data: null }));
    }
  };

  return {
    subscribe,
    fetch,
  };
}

export const weatherAPI = createApiStore();
