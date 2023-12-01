import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord";
import { Ok } from "unwrap";
import type { Result } from "unwrap";
import type { Feature } from "/core/Feature.ts";
import Command from "/core/Command.ts";

export default class Ping extends Command implements Feature {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  handler(interaction: ChatInputCommandInteraction): Result<void, string> {
    interaction.reply("Pong!");
    return Ok(undefined as never);
  }
}
