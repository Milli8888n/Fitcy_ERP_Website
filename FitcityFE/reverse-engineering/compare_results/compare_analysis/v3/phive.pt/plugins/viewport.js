import { defineNuxtPlugin } from "#app";
import { reactive } from "vue";
import { debounce } from "~/utils/async";
import { breakpoints } from "~/config/grid";

const DEBOUNCE_DELAY = 64;

const SERVER_DEFAULTS = {
  width: 390,
  height: 700,
  touch: true,
};

const viewport = reactive({
  width: SERVER_DEFAULTS.width,
  height: SERVER_DEFAULTS.height,
  touch: SERVER_DEFAULTS.touch,
  ready: false,
  breakpoints: breakpoints,
  SERVER: SERVER_DEFAULTS,
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:beforeMount", () => {
    function onWindowResize() {
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;

      viewport.touch = "ontouchstart" in window;
    }

    const debouncedOnWindowResize = debounce(onWindowResize, DEBOUNCE_DELAY);
    window.addEventListener("resize", debouncedOnWindowResize);

    window.vw = (v) => (v / 100) * viewport.width;
    window.vh = (v) => (v / 100) * viewport.height;
    Object.defineProperty(window, "touch", {
      get: () => "ontouchstart" in window,
    });

    onWindowResize();
    viewport.ready = true;
  });

  nuxtApp.provide("$viewport", viewport);
});
