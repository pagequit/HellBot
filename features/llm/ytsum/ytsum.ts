import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";
import { getSubs } from "./getSubs.ts";
import { Collection } from "unwrap";
import prompt from "../promt.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const localeMap = new Collection<Locale, string>();
localeMap.set(Locale.EnglishGB, "English");
localeMap.set(Locale.German, "German");

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description")
    .withStringOption("link", "linkDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { locale, options } = interaction;
    const link = new URL(options.getString("link", true));
    const youtubeDomains = ["www.youtube.com", "youtu.be"];

    if (!youtubeDomains.includes(link.hostname)) {
      interaction.reply({
        content: "Provided link is not a youtube link.",
        ephemeral: true,
      });
    }

    const response = await prompt(
      `Summarize this: "${
        (await getSubs(link)).unwrap()
      }", why should I care? Let me know whether this is a serious talk, or meant as a joke. Please respond in ${
        localeMap.get(locale).unwrapOr("English")
      }.`,
    );

    await interaction.deferReply();
    interaction.editReply({
      content: response.unwrapOr("Error"),
    });
  },
} satisfies Command;
