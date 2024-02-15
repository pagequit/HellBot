import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";
import { getSubs } from "./getSubs.ts";
import prompt from "../mistral/promt.ts";
import { type Core } from "/core/HellCore.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

let isThinking = false;

export default function (core: Core) {
  return {
    data: i18n.buildSlashCommand()
      .withName("name")
      .withDescription("description")
      .withStringOption("link", "linkDescription", true),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const { options, locale } = interaction;
      const link = new URL(options.getString("link", true));
      const youtubeDomains = ["www.youtube.com", "youtu.be"];

      if (!youtubeDomains.includes(link.hostname)) {
        interaction.reply({
          content: i18n.t(locale, "notAYouTubeLink"),
          ephemeral: true,
        });

        return;
      }

      if (isThinking) {
        interaction.reply({
          content: i18n.t(locale, "busy"),
          ephemeral: true,
        });

        return;
      }

      interaction.deferReply();

      const subs = await getSubs(link);
      if (subs.isErr()) {
        const err = subs.unwrapErr();
        core.logger.error(`${err.message}\n${link}`, err);

        interaction.editReply({
          content: i18n.t(locale, "noSubs"),
        });

        return;
      }

      isThinking = true;

      const response = await prompt(
        `"${subs}", summarize this. Why should I care? Let me know whether this is a serious talk, or ment as a joke.`,
      );

      isThinking = false;

      interaction.editReply({
        content: response.unwrapOrElse((err) => {
          core.logger.error(err.message, err);

          return "Error";
        }),
      });
    },
  } satisfies Command;
}
