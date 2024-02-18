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

export default function (core: Core) {
  return {
    data: new SlashCommandBuilder()
      .setName("chat")
      .setDescription("WIP")
      .addStringOption((option) => {
        return option
          .setName("content")
          .setDescription("WIP")
          .setRequired(true);
      }),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const { options } = interaction;
      const content = options.getString("content", true);

      const file = `${Deno.cwd()}/core/user.json`;
      const user = JSON.parse(Deno.readTextFileSync(file));

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
    },
  } as Command;
}
