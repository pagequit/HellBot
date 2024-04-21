import type { Feature } from "@/core/Feature.ts";
import { registerChatInputCommand } from "@/core/mod.ts";
import { timer } from "./timer.ts";

export default ((): void => {
  registerChatInputCommand(timer);
}) satisfies Feature;
