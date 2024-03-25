import type { RawTranslation } from "@/core/i18n/I18n.ts";

export default {
	description: () => "Erstellt eine einfache Umfrage.",
	subjects: () => "themen",
	subjectsDescription: () => "Mit Leerzeichen getrennte Liste von Themen.",
	replyExeption: () => "Es dürfen höchstens neun Themen angegeben werden.",
} satisfies RawTranslation;
