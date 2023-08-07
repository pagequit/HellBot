import { SlashCommandBuilder } from "npm:discord.js@14.12.1";

export default interface SlashCommand {
  data: SlashCommandBuilder;
  execute: () => Promise<void>;
}
