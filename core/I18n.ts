import { type LocaleString, SlashCommandBuilder } from "discord.js";
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

	buildSlashCommand(): I18nSlashCommandBuilder {
		return new I18nSlashCommandBuilder(this);
	}
}

export class I18nSlashCommandBuilder extends SlashCommandBuilder {
	i18n: I18n;

	constructor(i18n: I18n) {
		super();
		this.i18n = i18n;
	}

	withName(key: string): this {
		this.setName(this.i18n.t(this.i18n.source, key));
		for (const locale of this.i18n.translations.keys()) {
			this.setNameLocalization(locale, this.i18n.t(locale, key));
		}

		return this;
	}

	withDescription(key: string): this {
		this.setDescription(this.i18n.t(this.i18n.source, key));
		for (const locale of this.i18n.translations.keys()) {
			this.setDescriptionLocalization(locale, this.i18n.t(locale, key));
		}

		return this;
	}

	withStringOption(
		nameKey: string,
		descriptionKey: string,
		required = false,
	): this {
		this.addStringOption((option) => {
			option
				.setName(this.i18n.t(this.i18n.source, nameKey))
				.setDescription(this.i18n.t(this.i18n.source, descriptionKey))
				.setRequired(required);

			for (const locale of this.i18n.translations.keys()) {
				option
					.setNameLocalization(locale, this.i18n.t(locale, nameKey))
					.setDescriptionLocalization(
						locale,
						this.i18n.t(locale, descriptionKey),
					);
			}

			return option;
		});

		return this;
	}

	withNumberOption(
		nameKey: string,
		descriptionKey: string,
		required = false,
	): this {
		this.addNumberOption((option) => {
			option
				.setName(this.i18n.t(this.i18n.source, nameKey))
				.setDescription(this.i18n.t(this.i18n.source, descriptionKey))
				.setRequired(required);

			for (const locale of this.i18n.translations.keys()) {
				option
					.setNameLocalization(locale, this.i18n.t(locale, nameKey))
					.setDescriptionLocalization(
						locale,
						this.i18n.t(locale, descriptionKey),
					);
			}

			return option;
		});

		return this;
	}

	withIntegerOption(
		nameKey: string,
		descriptionKey: string,
		required = false,
	): this {
		this.addIntegerOption((option) => {
			option
				.setName(this.i18n.t(this.i18n.source, nameKey))
				.setDescription(this.i18n.t(this.i18n.source, descriptionKey))
				.setRequired(required);

			for (const locale of this.i18n.translations.keys()) {
				option
					.setNameLocalization(locale, this.i18n.t(locale, nameKey))
					.setDescriptionLocalization(
						locale,
						this.i18n.t(locale, descriptionKey),
					);
			}

			return option;
		});

		return this;
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
