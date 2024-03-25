import { SlashCommandBuilder } from "discord.js";
import type { I18n } from "./I18n.ts";

export default class I18nSlashCommandBuilder extends SlashCommandBuilder {
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
