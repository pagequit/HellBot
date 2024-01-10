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
    const { user, locale, options } = interaction;
    const minutes = options.getInteger("minutes")!;
    const timer = minutes * 60 * 1000;

    if (minutes < 1 || minutes > 1440) {
      interaction.reply({
        content: i18n.t(locale, "replyExeption"),
        ephemeral: true,
      });

      return;
    }

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel(i18n.t(locale, "cancel"))
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌"),
    );

    const response = await interaction.reply({
      content: i18n.t(locale, "replySet", String(minutes)),
      components: [actionRow],
      ephemeral: true,
    });

    response.awaitMessageComponent({
      filter: (i) => i.user.id === user.id,
      time: timer,
    }).then((i) => {
      i.update({
        content: i18n.t(locale, "replyCancel"),
        components: [],
      });
    }).catch(() => {
      interaction.editReply({
        components: [],
      });
      user.send(i18n.t(locale, "beep"));
    });
  },
} satisfies Command;
