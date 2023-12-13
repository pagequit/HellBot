import {
  type ChatInputCommandInteraction,
  type LocaleString,
  SlashCommandBuilder,
} from "discord";
import type { Command } from "./Command.ts";
import { Collection, Some } from "unwrap";

export type Translate = (...args: string[]) => string;
export type Translation = Collection<string, Translate>;
export type Translations = Collection<LocaleString, Translation>;
export type RawTranslation = {
  [key: string]: Translate;
};

export type I18nSlashCommandBuilder = {
  withName: (name: string) => I18nSlashCommandBuilder;
  withDescription: (description: string) => I18nSlashCommandBuilder;
} & SlashCommandBuilder;

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
      },
      withDescription: (description: string) => {
        builder.setDescription(this.t(this.source, description));
      },
    });

    return builder as I18nSlashCommandBuilder;
  }
}

export abstract class I18nCommand implements Command {
  i18n: I18n;
  data: SlashCommandBuilder;

  constructor(i18n: I18n, data: SlashCommandBuilder) {
    this.i18n = i18n;
    this.data = data;
  }

  abstract handle(interaction: ChatInputCommandInteraction): Promise<void>;
}
