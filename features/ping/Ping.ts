import type { ChatInputCommandInteraction } from "discord";
import type { Command } from "/core/Command.ts";
import { SlashCommandBuilder } from "discord";
import { i18n, useDefaults, useLocale } from "/core/i18n.ts";
import defaults from "./locale/defaults.ts";
import de from "./locale/de.ts";

export default class Ping implements Command {
  @useDefaults(defaults)
  @useLocale(de)
  data = new SlashCommandBuilder();

  async handle(interaction: ChatInputCommandInteraction) {
    await interaction.reply(i18n.t(interaction.locale, "example", "Pong"));
  }
}
