import type { Feature } from "@/core/Feature.ts";
import { registerChatInputGuildCommand } from "@/core/mod.ts";
import { auth } from "./auth.ts";

export default ((): void => {
  registerChatInputGuildCommand(auth);
}) satisfies Feature;
