import type { Command } from "./Command.ts";

export type Locale = {
  [key: string]: (...args: string[]) => string;
};

export function useDefaults(
  defaults: Locale & { name: () => string; description: () => string },
) {
  return (command: Command, _: string) => {
    command.data
      .setName(defaults.name())
      .setDescription(defaults.description());
  };
}

export function useLocale(
  locale: Locale & { name?: () => string; description: () => string },
) {
  return (command: Command, _: string) => {
    command.data
      .setDescriptionLocalizations({
        de: locale.description(),
      });
  };
}
