import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";

export type ChatInputCommandHandler = (
  interaction: ChatInputCommandInteraction,
) => void;

export interface Command {
  data: SlashCommandBuilder;
  handler: ChatInputCommandHandler;
}
