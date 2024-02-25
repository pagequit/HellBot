import {
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";
import { type Core } from "/core/HellCore.ts";
import { Model } from "./../Model.ts";
import { createChat } from "./chats.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

export default function (core: Core) {
  return {
    data: i18n.buildSlashCommand()
      .withName("name")
      .withDescription("description"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const { user } = interaction;

      const file = `${Deno.cwd()}/user.json`;
      const users = JSON.parse(Deno.readTextFileSync(file));

      const select = new StringSelectMenuBuilder()
        .setCustomId("model")
        .setPlaceholder("Select a model")
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel(Model.Gemini)
            .setValue(Model.Gemini),
          new StringSelectMenuOptionBuilder()
            .setLabel(Model.ChatGPT)
            .setValue(Model.ChatGPT),
          new StringSelectMenuOptionBuilder()
            .setLabel(Model.Mistral)
            .setValue(Model.Mistral),
        ]);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select);

      const response = await interaction.reply({
        content: "Select a model",
        components: [row],
      });

      response.awaitMessageComponent().then(({ value }) => {
        interaction.editReply({
          content: `${value} selected`,
          components: [],
        });
      });
    },
  } satisfies Command;
}
