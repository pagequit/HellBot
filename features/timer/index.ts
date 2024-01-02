import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import timer from "./timer.ts";

export default {
  setup(core: Core): void {
    core.addChatInputGuildCommand(timer);
  },
} satisfies Feature;
