import { Collection, Some } from "unwrap/mod.ts";

type Translate = (...args: string[]) => string;
type Translation = Collection<string, Translate>;
type Translations = Collection<LocaleString, Translation>;

export type RawTranslation = {
	[key: string]: Translate;
};

export class I18n {
	source: LocaleString;
	translations: Translations;

	constructor(translations: [LocaleString, RawTranslation][]) {
		this.source = translations[0][0];
		this.translations = Collection.from(
			translations.map(([locale, raw]) => {
				return [
					locale,
					Collection.from(Object.entries({ ...translations[0][1], ...raw })),
				];
			}),
		);
	}

	t(locale: LocaleString, key: string, ...args: string[]): string {
		return this.translations
			.get(locale)
			.or(this.translations.get(this.source))
			.unwrap()
			.get(key)
			.or(Some(() => key))
			.unwrap()(...args);
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

export type LocaleString = `${Locale}`;
