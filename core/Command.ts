import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";

export type ChatInputCommandHandle = (
  interaction: ChatInputCommandInteraction,
) => Promise<void>;

export type Command = {
  data: SlashCommandBuilder;
  execute: ChatInputCommandHandle;
};
