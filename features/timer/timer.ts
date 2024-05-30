import {
  type ChatInputCommand,
  Locale,
  logger,
  store,
  useI18n,
} from "@/core/mod.ts";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js";
import { Collection } from "unwrap/mod.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

const { i18n, i18nSlashCommandBuilder } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const timers = new Collection<string, number>();

export const timer: ChatInputCommand = {
  data: i18nSlashCommandBuilder
    .withName("name")
    .withDescription("description")
    .withIntegerOption("minutes", "minutesDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    logger.log("timer", store); // DELTEME
    const { user, locale, options } = interaction;
    const minutes = options.getInteger("minutes", true);
    const ms = minutes * 60 * 1000;
    const timer = ms + Date.now();

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
          String(Math.floor((remainingTime / 1000) % 60)),
        ),
        ephemeral: true,
      });

      return;
    }

    const response = await interaction.reply({
      content: i18n.t(locale, "replySet", `<t:${Math.floor(timer / 1000)}:R>`),
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel(i18n.t(locale, "cancel"))
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("❌"),
        ),
      ],
      ephemeral: true,
    });

    timers.set(user.id, timer);

    response
      .awaitMessageComponent({
        time: ms,
        dispose: true,
      })
      .then(() => {
        interaction.editReply({
          content: i18n.t(locale, "replyCancel"),
          components: [],
        });
      })
      .catch(() => {
        interaction.editReply({
          content: i18n.t(locale, "replyIsUp"),
          components: [],
        });
        user.send(i18n.t(locale, "beep"));
      })
      .finally(() => {
        timers.delete(user.id);
      });
  },
};
