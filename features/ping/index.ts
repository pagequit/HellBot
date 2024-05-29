import type { Feature } from "@/core/Feature.ts";
import { logger, store } from "@/core/mod";
import { registerChatInputCommand } from "@/core/mod";
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
      logger.log("ping", store); // DELTEME
      await interaction.reply("pong");
    },
  });
}) satisfies Feature;
