import {
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord";
import { Command } from "/core/Command.ts";
import geminiChat from "./gemini/gemini.ts";

const Models = {
  Gemini: "gemini-pro",
  ChatGPT: "gpt-3.5-turbo",
  Mistral: "mistral-7b",
} as const;

export default {
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
          .setLabel(Models.Gemini)
          .setValue(Models.Gemini),
        new StringSelectMenuOptionBuilder()
          .setLabel(Models.ChatGPT)
          .setValue(Models.ChatGPT),
        new StringSelectMenuOptionBuilder()
          .setLabel(Models.Mistral)
          .setValue(Models.Mistral),
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(select);

    const response = await interaction.reply({
      content: "Select a model",
      components: [row],
    });
  },
} as Command;
