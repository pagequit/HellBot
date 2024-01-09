import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord";
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
    .withDescription("description")
    .withIntegerOption("minutes", "minutesDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const minutes = interaction.options.getInteger("minutes")!;
    const timer = minutes * 60 * 1000;

    if (minutes > 1440) {
      await interaction.reply("Too much time!");
    }

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌"),
    );

    const response = await interaction.reply({
      content: "Timer is set to " + minutes + " minutes.",
      components: [actionRow],
    });

    const cancel = await response.awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      time: timer,
    });

    if (cancel) {
      await interaction.editReply({
        content: "Timer is canceled.",
        components: [],
      });
    }
  },
} satisfies Command;
