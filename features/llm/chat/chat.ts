import type { Command } from "@/core/Command.ts";
import type { Core } from "@/core/HellCore.ts";
import { Locale } from "@/core/i18n/I18n.ts";
import { useI18n } from "@/core/i18n/useI18n.ts";
import {
	ActionRowBuilder,
	type ChatInputCommandInteraction,
	StringSelectMenuBuilder,
	type StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
} from "discord.js";
import llmUser from "../chat/user.json";
import { createChat } from "../chats.ts";
import { Model } from "./../Model.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

const { i18n, i18nSlashCommandBuilder } = useI18n([
	[Locale.EnglishGB, en],
	[Locale.German, de],
]);

export default function (core: Core) {
	return {
		data: i18nSlashCommandBuilder
			.withName("name")
			.withDescription("description"),
		async execute(interaction: ChatInputCommandInteraction): Promise<void> {
			const { user, locale } = interaction;

			const select = new StringSelectMenuBuilder()
				.setCustomId("model")
				.setPlaceholder(i18n.t(locale, "select"))
				.addOptions([
					new StringSelectMenuOptionBuilder()
						.setLabel(Model.Gemini)
						.setValue(Model.Gemini),
					new StringSelectMenuOptionBuilder()
						.setLabel(Model.ChatGPT)
						.setValue(Model.ChatGPT),
					new StringSelectMenuOptionBuilder()
						.setLabel(Model.Mistral)
						.setValue(Model.Mistral),
				]);

			const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				select,
			);

			const response = await interaction.reply({
				content: i18n.t(locale, "disclaimer"),
				components: [row],
				ephemeral: true,
			});

			response.awaitMessageComponent().then((i) => {
				const value = (i as StringSelectMenuInteraction).values[0] as Model;
				createChat(value, user.id);

				Bun.write(
					`${process.cwd()}/features/llm/chat/user.json`,
					new TextEncoder().encode(
						JSON.stringify({ ...llmUser, [user.id]: value }, null, 2),
					),
				).catch((error) => {
					core.logger.error((error as Error).message, error);
				});

				interaction.editReply({
					content: i18n.t(locale, "confirmation", value),
					components: [],
				});
			});
		},
	} satisfies Command;
}
