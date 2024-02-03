import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";
import { getSubs } from "./getSubs.ts";
import prompt from "../promt.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

let isThinking = false;

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description")
    .withStringOption("link", "linkDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { options } = interaction;
    const link = new URL(options.getString("link", true));
    const youtubeDomains = ["www.youtube.com", "youtu.be"];

    if (!youtubeDomains.includes(link.hostname)) {
      interaction.reply({
        content: "Provided link is not a youtube link.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    if (isThinking) {
      interaction.editReply({
        content: "I'm busy, please wait.",
      });
    }

    isThinking = true;

    const response = await prompt(
      `"${
        (await getSubs(link)).unwrap()
      }", summarize this. Why should I care? Let me know whether this is a serious talk, or ment as a joke.`,
    );

    isThinking = false;

    interaction.editReply({
      content: response.unwrapOr("Error"),
    });
  },
} satisfies Command;
