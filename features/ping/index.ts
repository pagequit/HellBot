import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import type { Command } from "/core/Command.ts";
import { SlashCommandBuilder } from "discord";

export default {
  setup(core: HellCore): void {
    core.addChatInputCommand(
      {
        data: new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Replies with Pong!"),

        async handle(interaction) {
          await interaction.reply("Pong!");
        },
      } satisfies Command,
    );
  },
} satisfies Feature;
