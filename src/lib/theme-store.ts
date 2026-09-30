import { DEFAULT_THEME, isTheme, STORAGE_KEY, type ThemeName } from "./themes";

// The active theme lives on <html data-theme>, where the pre-paint script and
// the CSS token overrides read it. React subscribes to it from here.
const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTheme(): ThemeName {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : DEFAULT_THEME;
}

export const getServerTheme = (): ThemeName => DEFAULT_THEME;

export function setTheme(name: ThemeName) {
  if (name === DEFAULT_THEME) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // Blocked storage: the theme still applies for this visit.
  }
  listeners.forEach((l) => l());
}
