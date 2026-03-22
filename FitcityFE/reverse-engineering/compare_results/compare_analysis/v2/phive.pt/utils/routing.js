import { convertToSlug } from "./strings";

export function removeTrailingSlash(str) {
  if (typeof str === "string") {
    if (str === "/") {
      return str;
    }

    return str.replace(/\/+$/, "");
  } else {
    return str;
  }
}

export function removeLeadingSlash(str) {
  if (typeof str === "string") {
    if (str === "/") {
      return str;
    }

    return str.replace(/^\/+/, "");
  } else {
    return str;
  }
}

export function replaceRouteState({ title, pathname }) {
  const originalPathname = window.location.pathname + window.location.search;
  const originalTitle = document.querySelector("title").innerHTML;

  history.replaceState("", null, pathname);
  document.title = title;

  function revert() {
    document.title = originalTitle;
    history.replaceState("", null, originalPathname);
  }

  return revert;
}

export function createFauxRouteEntry(pathname, onPopstate) {
  const currentPathname = window.location.pathname;

  if (currentPathname !== pathname) {
    window.history.pushState("", null, pathname);
  }

  window.addEventListener("popstate", onPopstate, { once: true });

  function destroy() {
    window.removeEventListener("popstate", onPopstate, { once: true });
  }

  return destroy;
}

export function ctaUrl(cta) {
  if (cta.type === "external") return cta.href;
  else if (cta && cta.type === "openContactForm")
    return `/contact?currentform=${cta.slug}`;
  else if (cta && cta.type === "section")
    return `#${convertToSlug(cta.section)}`;
  else return `/${cta.slug}`;
}
