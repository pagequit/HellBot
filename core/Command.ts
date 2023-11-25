import type { SlashCommandBuilder } from "discord";

export interface Command {
  name: string;
  data: SlashCommandBuilder;
  handler: (args: string[]) => void;
}
