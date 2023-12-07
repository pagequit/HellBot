import type { ChatInputCommandInteraction } from "discord";
import type { Command } from "/core/Command.ts";
import type I18n from "/core/i18n.ts";
import { SlashCommandBuilder } from "discord";
import { locale, useI18n } from "/core/i18n.ts";

@useI18n
export default class Ping implements Command, I18n {
  @locale("de")
  data = new SlashCommandBuilder();

  async handle(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!");
  }
}
