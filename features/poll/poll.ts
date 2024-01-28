import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description")
    .withStringOption("subjects", "subjectsDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subjects = [
      ...interaction.options.getString("subjects", true).matchAll(/[^\s,]+/g),
    ].flat();

    if (subjects.length > emojis.length) {
      interaction.reply({
        content: i18n.t(interaction.locale, "replyExeption"),
        ephemeral: true,
      });

      return;
    }

    const selected: string[] = [];
    const reply = subjects.reduce((acc, cur, idx) => {
      const emoji = emojis[idx];
      selected.push(emoji);

      return `${acc}${emoji}: ${cur}\n`;
    }, "");

    const responseMessage = await (await interaction.reply(reply)).fetch();
    for (const emoji of selected) {
      await responseMessage.react(emoji);
    }
  },
} satisfies Command;
