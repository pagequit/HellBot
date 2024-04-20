import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type ChatInputCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
