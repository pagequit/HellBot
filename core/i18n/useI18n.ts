import { I18n, type LocaleString, type RawTranslation } from "./I18n";
import I18nSlashCommandBuilder from "./I18nSlashCommandBuilder.ts";

export function useI18n(translations: [LocaleString, RawTranslation][]): {
  i18n: I18n;
  i18nSlashCommandBuilder: I18nSlashCommandBuilder;
} {
  const i18n = new I18n(translations);
  const i18nSlashCommandBuilder = new I18nSlashCommandBuilder(i18n);

  return { i18n, i18nSlashCommandBuilder };
}
