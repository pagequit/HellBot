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
import { Collection } from "unwrap";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const timers = new Collection<string, number>();

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description")
    .withIntegerOption("minutes", "minutesDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { user, locale, options } = interaction;
    const minutes = options.getInteger("minutes", true);
    const timer = minutes * 60 * 1000;

    if (minutes < 1 || minutes > 1440) {
      interaction.reply({
        content: i18n.t(locale, "replyExeption"),
        ephemeral: true,
      });

      return;
    }

    const previousTimer = timers.get(user.id);
    if (previousTimer.isSome()) {
      const remainingTime = previousTimer.unwrap() - Date.now();
      interaction.reply({
        content: i18n.t(
          locale,
          "replyAlreadySet",
          String(Math.floor(remainingTime / 1000 / 60)),
          String(Math.floor(remainingTime / 1000 % 60)),
        ),
        ephemeral: true,
      });

      return;
    }

    const response = await interaction.reply({
      content: i18n.t(locale, "replySet", String(minutes)),
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel(i18n.t(locale, "cancel"))
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❌"),
      )],
      ephemeral: true,
    });

    timers.set(user.id, timer + Date.now());

    response.awaitMessageComponent({
      time: timer,
      dispose: true,
    }).then(() => {
      interaction.editReply({
        content: i18n.t(locale, "replyCancel"),
        components: [],
      });
    }).catch(() => {
      interaction.editReply({
        content: i18n.t(locale, "replyIsUp"),
        components: [],
      });
      user.send(i18n.t(locale, "beep"));
    }).finally(() => {
      timers.delete(user.id);
    });
  },
} satisfies Command;
