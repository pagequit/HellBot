import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import type { Result } from "unwrap";

export type Feature<T> = {
  register: (
    register: (
      data: SlashCommandBuilder,
      handler: (interaction: ChatInputCommandInteraction) => void,
    ) => Result<void, string>,
  ) => Result<void, string>;
} & T;
