import type { Command } from "@/core/Command.ts";
import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

function auth(_core: Core): Command {
	return {
		data: new SlashCommandBuilder()
			.setName("auth")
			.setDescription("Authenticate with Supabase"),
		async execute(interaction: ChatInputCommandInteraction): Promise<void> {
			const inviteLink = "WIP";
			await interaction.user.send(inviteLink);
		},
	};
}

export default {
	setup(core: Core): void {
		core.addChatInputCommand(auth(core));
	},
} satisfies Feature;
