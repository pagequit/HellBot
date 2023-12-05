import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import type { Command } from "/core/Command.ts";
import { SlashCommandBuilder } from "discord";

export default {
  setup(core: HellCore): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = core.addChatInputCommand(
        "ping",
        {
          data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with Pong!"),

          async handle(interaction) {
            await interaction.reply("Pong!");
          },
        } satisfies Command,
      );

      if (result.isOk()) {
        resolve();
      } else {
        reject(result.unwrapErr());
      }
    });
  },
} satisfies Feature;
