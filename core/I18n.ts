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
      return [locale, Collection.from(Object.entries(raw))];
    }));
  }

  t(locale: LocaleString, key: string, ...args: string[]): string {
    return this.translations.get(locale).or(
      this.translations.get(this.source),
    ).unwrap().get(key).or(Some(() => key)).unwrap()(...args);
  }

  buildSlashCommand(): I18nSlashCommandBuilder {
    const builder = new SlashCommandBuilder();
    Object.assign(builder, {
      withName: (key: string) => {
        builder.setName(this.t(this.source, key));
        for (const locale of this.translations.keys()) {
          builder.setNameLocalization(locale, this.t(locale, key));
        }
      },
      withDescription: (key: string) => {
        builder.setDescription(this.t(this.source, key));
        for (const locale of this.translations.keys()) {
          builder.setDescriptionLocalization(
            locale,
            this.t(locale, key),
          );
        }
      },
    });

    return builder as I18nSlashCommandBuilder;
  }
}
