export const DEFAULT_THEME = "warm";
export const THEME_NAMES = [
  DEFAULT_THEME,
  "gruvbox",
  "dracula",
  "nord",
  "monokai",
  "solarized",
] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

export const STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is ThemeName {
  return THEME_NAMES.includes(value as ThemeName);
}

/**
 * Runs in <head> before first paint so a saved theme never flashes the
 * default palette. Storage may be blocked, so every access is guarded.
 */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(${JSON.stringify(THEME_NAMES.slice(1))}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;
