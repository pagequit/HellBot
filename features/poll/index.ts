import { type Core } from "/core/HellCore.ts";
import { type Feature } from "/core/Feature.ts";
import poll from "./poll.ts";

export default {
  setup(core: Core): void {
    core.addChatInputGuildCommand(poll);
  },
} satisfies Feature;
