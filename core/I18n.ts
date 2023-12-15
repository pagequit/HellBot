import { type LocaleString, SlashCommandBuilder } from "discord";
import { Collection, Some } from "unwrap";

type Translate = (...args: string[]) => string;
type Translation = Collection<string, Translate>;
type Translations = Collection<LocaleString, Translation>;

type I18nSlashCommandMethod = (key: string) => I18nSlashCommandBuilder;
type I18nSlashCommandBuilder = {
  withName: I18nSlashCommandMethod;
  withDescription: I18nSlashCommandMethod;
} & SlashCommandBuilder;

export type RawTranslation = {
  [key: string]: Translate;
};

export class I18n {
  source: LocaleString;
  translations: Translations;

  constructor(
    translations: [LocaleString, RawTranslation][],
  ) {
    this.source = translations[0][0];
    this.translations = Collection.from(translations.map(([locale, raw]) => {
      return [
        locale,
        Collection.from(Object.entries({ ...translations[0][1], ...raw })),
      ];
    }));
  }

  t(locale: LocaleString, key: string, ...args: string[]): string {
    return this.translations.get(locale).or(
      this.translations.get(this.source),
    ).unwrap().get(key).or(Some(() => key)).unwrap()(...args);
  }

  buildSlashCommand(): I18nSlashCommandBuilder {
    const builder = new SlashCommandBuilder() as I18nSlashCommandBuilder;

    Object.assign(builder, {
      withName: (key: string): I18nSlashCommandBuilder => {
        builder.setName(this.t(this.source, key));
        for (const locale of this.translations.keys()) {
          builder.setNameLocalization(locale, this.t(locale, key));
        }

        return builder;
      },
      withDescription: (key: string): I18nSlashCommandBuilder => {
        builder.setDescription(this.t(this.source, key));
        for (const locale of this.translations.keys()) {
          builder.setDescriptionLocalization(locale, this.t(locale, key));
        }

        return builder;
      },
    });

    return builder;
  }
}

/**
 * https://discord.com/developers/docs/reference#locales
 */
export enum Locale {
  Indonesian = "id",
  EnglishUS = "en-US",
  EnglishGB = "en-GB",
  Bulgarian = "bg",
  ChineseCN = "zh-CN",
  ChineseTW = "zh-TW",
  Croatian = "hr",
  Czech = "cs",
  Danish = "da",
  Dutch = "nl",
  Finnish = "fi",
  French = "fr",
  German = "de",
  Greek = "el",
  Hindi = "hi",
  Hungarian = "hu",
  Italian = "it",
  Japanese = "ja",
  Korean = "ko",
  Lithuanian = "lt",
  Norwegian = "no",
  Polish = "pl",
  PortugueseBR = "pt-BR",
  Romanian = "ro",
  Russian = "ru",
  SpanishES = "es-ES",
  Swedish = "sv-SE",
  Thai = "th",
  Turkish = "tr",
  Ukrainian = "uk",
  Vietnamese = "vi",
}
