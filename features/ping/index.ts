import type { Command } from "/core/Command.ts";
import { SlashCommandBuilder } from "discord";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async handle(interaction) {
    await interaction.reply("Pong!");
  },
} satisfies Command;
