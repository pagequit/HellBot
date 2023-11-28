import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import type { Result } from "unwrap";
import type { Feature } from "./Feature.ts";

export type ChatInputCommandHandler = (
  interaction: ChatInputCommandInteraction,
) => Result<void, string>;

export type Command = {
  data: SlashCommandBuilder;
  handler: ChatInputCommandHandler;
};

export function commandDecorator(
  data: SlashCommandBuilder,
  handler: ChatInputCommandHandler,
  register: (
    register: (
      data: SlashCommandBuilder,
      handler: ChatInputCommandHandler,
    ) => Result<void, string>,
  ) => Result<void, string>,
): Feature<Command> {
  return {
    data,
    handler,
    register,
  };
}
