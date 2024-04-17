import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Collection } from "unwrap/mod.ts";

const chatInputCommands = new Collection<string, ChatInputCommand>();
const chatInputGuildCommands = new Collection<string, ChatInputCommand>();

export { chatInputCommands, chatInputGuildCommands };

export type ChatInputCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
