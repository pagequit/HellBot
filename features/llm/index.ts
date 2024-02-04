import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import ytsum from "./ytsum/ytsum.ts";

export default {
  setup(core: Core): void {
    core.addChatInputCommand(ytsum);
  },
} satisfies Feature;
