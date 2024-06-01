import { I18n, type Locale, type RawTranslation } from "@/core/i18n/I18n.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { storeToRefs } from "pinia";

const settings = useSettings();
const { locale } = storeToRefs(settings);

export function useI18n(translations: [Locale, RawTranslation][]): {
  t: (key: string, ...args: string[]) => string;
} {
  const i18n = new I18n(translations);

  return {
    t: (key: string, ...args: string[]): string => {
      return i18n.t(locale.value, key, ...args);
    },
  };
}
