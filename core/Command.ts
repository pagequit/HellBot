import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import type { Result } from "unwrap";
import type HellCore from "./HellCore.ts";

export type ChatInputCommandHandler = (
  interaction: ChatInputCommandInteraction,
) => Result<void, string>;

export type CommandDTO = {
  name: string;
  data: SlashCommandBuilder;
  handler: ChatInputCommandHandler;
};

export default abstract class Command {
  data: SlashCommandBuilder;

  constructor(
    data: SlashCommandBuilder,
  ) {
    this.data = data;
  }

  abstract handler(
    interaction: ChatInputCommandInteraction,
  ): Result<void, string>;

  register(register: HellCore["register"]): Result<void, string> {
    return register({
      name: this.data.name,
      data: this.data,
      handler: this.handler,
    });
  }
}
