import type { Feature } from "@/core/Feature.ts";
import { registerChatInputCommand } from "@/core/discord/registerCommand.ts";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export default ((): void => {
  registerChatInputCommand({
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with 'pong'."),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      await interaction.reply("pong");
    },
  });
}) satisfies Feature;
