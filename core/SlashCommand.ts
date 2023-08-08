import { SlashCommandBuilder } from "discord";

export default interface SlashCommand {
  data: SlashCommandBuilder;
  execute: () => Promise<void>;
}
