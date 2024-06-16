import type { Feature } from "@/core/Feature.ts";
import { registerChatInputCommand } from "@/core/discord/registerCommand.ts";
import { timer } from "./timer.ts";

export default ((): void => {
  registerChatInputCommand(timer);
}) satisfies Feature;
