import type { Feature } from "@/core/Feature.ts";
import { registerChatInputGuildCommand } from "@/core/mod.ts";
import { poll } from "./poll.ts";

export default ((): void => {
  registerChatInputGuildCommand(poll);
}) satisfies Feature;
