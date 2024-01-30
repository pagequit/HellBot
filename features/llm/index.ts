import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import ytsum from "./ytsum/ytsum.ts";

export default {
  setup(core: Core): void {
    if (false) {
      core.addChatInputCommand(ytsum);
    } else {
      // core.logger.warn("no llm");
    }
  },
} satisfies Feature;
