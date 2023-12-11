import type { ChatInputCommandInteraction, LocaleString } from "discord";
import type { Command } from "./Command.ts";
import type { Collection } from "unwrap";

export type Locale = {
  [key: string]: (...args: string[]) => string; // TODO
};

export class I18n {
  translations: Collection<LocaleString, Locale>;

  constructor(translations: Collection<LocaleString, Locale>) {
    this.translations = translations;
  }

  t(locale: LocaleString, key: string, ...args: string[]): string {
    return this.translations.get(locale).getOrInsert({
      [key]: () => key,
    })[key](...args); // FIXME
  }
}

export abstract class I18nCommand implements Command {
  i18n: I18n;
  data: Command["data"];

  constructor(i18n: I18n, data: Command["data"]) {
    this.i18n = i18n;
    this.data = data;
  }

  abstract handle(interaction: ChatInputCommandInteraction): Promise<void>;
}
