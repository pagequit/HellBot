import type { RawTranslation } from "@/core/I18n.ts";

export default {
	name: () => "poll",
	description: () => "Creates a simple poll.",
	subjects: () => "subjects",
	subjectsDescription: () => "A whitespace separated list of subjects.",
	replyExeption: () => "A maximum of nine subjects may be specified.",
} satisfies RawTranslation;
