import { defineNuxtRouteMiddleware, abortNavigation } from "#imports";
import { getPathLocale } from "./helpers";

// perform full-reload when changing locales
export const middleware = defineNuxtRouteMiddleware((to, from) => {
  const fromLocale = getPathLocale(from.path);
  const toLocale = getPathLocale(to.path);

  if (fromLocale !== toLocale) {
    window.location.href = to.fullPath;
    return abortNavigation();
  }
});
