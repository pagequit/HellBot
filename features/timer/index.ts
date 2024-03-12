import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import timer from "./timer.ts";

export default {
	setup(core: Core): void {
		core.addChatInputCommand(timer);
	},
} satisfies Feature;
