import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import type { Result } from "unwrap";

export type ChatInputCommandHandler = (
  interaction: ChatInputCommandInteraction,
) => Result<void, string>;

export interface Command {
  data: SlashCommandBuilder;
  handler: ChatInputCommandHandler;
}
