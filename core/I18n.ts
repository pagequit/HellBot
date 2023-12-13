import { type LocaleString, SlashCommandBuilder } from "discord";
import { Collection, Some } from "unwrap";

type Translate = (...args: string[]) => string;
type Translation = Collection<string, Translate>;
type Translations = Collection<LocaleString, Translation>;

type I18nSlashCommandBuilder = {
  withName: (name: string) => I18nSlashCommandBuilder;
  withDescription: (description: string) => I18nSlashCommandBuilder;
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
      withName: (name: string) => {
        builder.setName(this.t(this.source, name));
        for (const locale of this.translations.keys()) {
          builder.setNameLocalization(locale, this.t(locale, name));
        }
      },
      withDescription: (description: string) => {
        builder.setDescription(this.t(this.source, description));
        for (const locale of this.translations.keys()) {
          builder.setDescriptionLocalization(
            locale,
            this.t(locale, description),
          );
        }
      },
    });

    return builder as I18nSlashCommandBuilder;
  }
}
