import type { Command } from "@/core/Command.ts";
import type { Core } from "@/core/HellCore.ts";
import { useStore } from "@/core/composables/useStore.ts";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export default function auth(_core: Core): Command {
  return {
    data: new SlashCommandBuilder().setName("auth").setDescription("WIP"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const token = Math.random().toString(16).substring(2);
      const inviteLink = `http://localhost:8080/auth/${token}`;

      useStore().set(token, interaction.user.id);

      interaction.reply({
        content: inviteLink,
        ephemeral: true,
      });
    },
  };
}
