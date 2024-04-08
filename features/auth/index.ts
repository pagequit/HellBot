import type { Command } from "@/core/Command.ts";
import { useCrappyStore } from "@/core/CrappyStore.ts";
import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const crappyStore = useCrappyStore();

function auth(_core: Core): Command {
  return {
    data: new SlashCommandBuilder().setName("auth").setDescription("WIP"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const token = Math.random().toString(16).substring(2);
      const inviteLink = `http://localhost:8080/auth/${token}`;

      crappyStore.set(token, interaction.user.id);

      interaction.reply({
        content: inviteLink,
        ephemeral: true,
      });
    },
  };
}

export default {
  setup(core: Core): void {
    core.addChatInputGuildCommand(auth(core));
  },
} satisfies Feature;
