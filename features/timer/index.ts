import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import timer from "./timer.ts";

export default {
  setup(core: HellCore): void {
    core.addChatInputCommand(timer);
  },
} satisfies Feature;
