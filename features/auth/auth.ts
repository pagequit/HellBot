import { server } from "@/config.ts";
import { type ChatInputCommand, store } from "@/core/mod.ts";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const auth: ChatInputCommand = {
  data: new SlashCommandBuilder().setName("auth").setDescription("WIP"),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const token = Math.random().toString(16).substring(2);
    const inviteLink = `${server.origin}/auth/${token}`;

    store.set(token, interaction.user.id);

    interaction.reply({
      content: inviteLink,
      ephemeral: true,
    });
  },
};
