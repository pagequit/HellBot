import type { Command } from "/core/Command.ts";

export default {
  name: "help",
  execute: (_args: string[]) => {
    console.log("help");
  },
} satisfies Command;
