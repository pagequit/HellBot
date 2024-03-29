import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

export default {
	setup(core: Core): void {
		core.addChatInputCommand({
			data: new SlashCommandBuilder()
				.setName("ping")
				.setDescription("Replies with 'pong'."),
			async execute(interaction: ChatInputCommandInteraction): Promise<void> {
				await interaction.reply("pong");
			},
		});
	},
} satisfies Feature;
