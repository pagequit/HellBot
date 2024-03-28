import { Locale } from "@/core/i18n/I18n.ts";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export function canUseLocalStorage(): boolean {
	return "localStorage" in window && navigator.cookieEnabled;
}

const defaultLocale = [Locale.EnglishGB, Locale.German].includes(
	navigator.language as Locale,
)
	? (navigator.language as Locale)
	: Locale.EnglishGB;

const initialLocale = canUseLocalStorage()
	? (localStorage.getItem("locale") as Locale) ?? defaultLocale
	: defaultLocale;

const initialTheme = canUseLocalStorage()
	? (localStorage.getItem("locale") as Locale) ??
	  window.matchMedia("(prefers-color-scheme: light)").matches
		? "light"
		: "dark"
	: window.matchMedia("(prefers-color-scheme: light)").matches
	  ? "light"
	  : "dark";

export const useSettings = defineStore("settings", () => {
	const locale: Ref<Locale> = ref(initialLocale);
	const theme: Ref<"light" | "dark"> = ref(initialTheme);

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
