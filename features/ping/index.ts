import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord";

export default {
  setup(core: Core): void {
    core.addChatInputCommand({
      data: new SlashCommandBuilder()
        .setName("ping"),
      async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("pong");
      },
    });
  },
} satisfies Feature;
