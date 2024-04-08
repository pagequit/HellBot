import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type ChatInputCommandHandle = (
  interaction: ChatInputCommandInteraction,
) => Promise<void>;

export type Command = {
  data: SlashCommandBuilder;
  execute: ChatInputCommandHandle;
};
