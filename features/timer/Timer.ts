import type { ChatInputCommandInteraction } from "discord";
import type { I18n } from "/core/I18n.ts";
import { I18nCommand } from "/core/I18n.ts";
import { SlashCommandBuilder } from "discord";

export default class Timer extends I18nCommand {
  constructor(i18n: I18n) {
    super(
      i18n,
      new SlashCommandBuilder()
        .setName("timer")
        .setDescription(i18n.t("en-GB", "description"))
        .setDescriptionLocalization("de", i18n.t("de", "description")),
    );
  }

  async handle(interaction: ChatInputCommandInteraction) {
    await interaction.reply(this.i18n.t(interaction.locale, "example", "Pong"));
  }
}
