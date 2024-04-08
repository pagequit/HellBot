import { Locale } from "@/core/i18n/I18n.ts";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export function canUseLocalStorage(): boolean {
  return "localStorage" in window && navigator.cookieEnabled;
}

export type Theme = "light" | "dark";

const defaultLocale = [Locale.EnglishGB, Locale.German].includes(
  navigator.language as Locale,
)
  ? (navigator.language as Locale)
  : Locale.EnglishGB;

const initialLocale = canUseLocalStorage()
  ? (localStorage.getItem("locale") as Locale) ?? defaultLocale
  : defaultLocale;

const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
  ? "light"
  : "dark";

const initialTheme = canUseLocalStorage()
  ? (localStorage.getItem("theme") as Theme) ?? systemTheme
  : systemTheme;

export const useSettings = defineStore("settings", () => {
  const locale: Ref<Locale> = ref(initialLocale);
  const theme: Ref<Theme> = ref(initialTheme);

  function setLocale(newLocale: Locale) {
    locale.value = newLocale;
    if (canUseLocalStorage()) {
      localStorage.setItem("locale", newLocale);
    }
  }

  function setTheme(newTheme: "light" | "dark") {
    theme.value = newTheme;
    if (canUseLocalStorage()) {
      localStorage.setItem("theme", newTheme);
    }
  }

  return { locale, setLocale, theme, setTheme };
});
