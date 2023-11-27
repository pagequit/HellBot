import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import { Ok } from "unwrap";
import type { Result } from "unwrap";
import type { Feature } from "/core/Feature.ts";
import type { ChatInputCommandHandler, Command } from "/core/Command.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  handler(interaction: ChatInputCommandInteraction) {
    interaction.reply("Pong!");
    return Ok(undefined as never);
  },
  register(
    register: (
      data: SlashCommandBuilder,
      handler: ChatInputCommandHandler,
    ) => Result<void, string>,
  ): Result<void, string> {
    return register(this.data, this.handler);
  },
} satisfies Feature<Command>;
