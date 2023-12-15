import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description"),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply(
      i18n.t(interaction.locale, "example", "timer", "unused argument"),
    );
  },
} satisfies Command;
