import {
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord";
import { Command } from "/core/Command.ts";
import { type Core } from "/core/HellCore.ts";
import { Model } from "./../Model.ts";
import { createChat } from "./chats.ts";

export default function (core: Core) {
  return {
    data: new SlashCommandBuilder()
      .setName("chat")
      .setDescription("WIP"),
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
  } as Command;
}
