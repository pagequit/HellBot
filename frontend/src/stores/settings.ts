import { Locale } from "@/core/i18n/I18n.ts";
import { canUseLocalStorage } from "@/frontend/src/composables/canUseLocalStorage.ts";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export type Theme = "light" | "dark";

export type Settings = {
  locale: Ref<Locale>;
  theme: Ref<Theme>;
  setLocale: (newLocale: Locale) => void;
  setTheme: (newTheme: Theme) => void;
};

const defaultLocale = [Locale.EnglishGB, Locale.German].includes(
  navigator.language as Locale,
)
  ? (navigator.language as Locale)
  : Locale.EnglishGB;

const initialLocale = canUseLocalStorage()
  ? (localStorage.getItem("locale") as Locale) ?? defaultLocale
  : defaultLocale;

const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: light)")
  .matches
  ? "light"
  : "dark";

const initialTheme = canUseLocalStorage()
  ? (localStorage.getItem("theme") as Theme) ?? systemTheme
  : systemTheme;

export const useSettings = defineStore("settings", (): Settings => {
  const locale: Ref<Locale> = ref(initialLocale);
  const theme: Ref<Theme> = ref(initialTheme);

  function setLocale(newLocale: Locale): void {
    locale.value = newLocale;
    if (canUseLocalStorage()) {
      localStorage.setItem("locale", newLocale);
    }
  }

  function setTheme(newTheme: Theme): void {
    theme.value = newTheme;
    if (canUseLocalStorage()) {
      localStorage.setItem("theme", newTheme);
    }
  }

  return { locale, setLocale, theme, setTheme };
});
