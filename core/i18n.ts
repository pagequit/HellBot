import { SlashCommandBuilder } from "discord";
import type { Command } from "./Command.ts";

export default class I18n {
  t = translate;
}

export function useI18n<T extends { i18n: I18n }>(target: T) {
  target.i18n = new I18n();
}

export function translate(message: string): string {
  return message;
}

export function useDefaults(command: Command, _: string) {
  command.data = new SlashCommandBuilder();
}

export function defaults(command: Command, _: string) {
  command.data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
}

export function locale(locale?: string) {
  return (command: Command, _: string) => {
    command.data = new SlashCommandBuilder()
      .setDescriptionLocalizations({
        de: "Antwortet mit Pong!",
      });
  };
}
