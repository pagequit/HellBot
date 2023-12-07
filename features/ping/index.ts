import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import Ping from "./Ping.ts";

export default {
  setup(core: HellCore): void {
    core.addChatInputCommand(new Ping());
  },
} satisfies Feature;
