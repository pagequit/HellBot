import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import { SlashCommandBuilder } from "discord";

export default {
  setup(core: HellCore): void {
    core.addChatInputCommand({
      data: new SlashCommandBuilder()
        .setName("ping"),
      handle: async (interaction) => {
        await interaction.reply("pong");
      },
    });
  },
} satisfies Feature;
