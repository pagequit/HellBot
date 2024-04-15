import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import auth from "./auth.ts";

export default {
  setup(core: Core): void {
    core.addChatInputGuildCommand(auth(core));
  },
} satisfies Feature;
