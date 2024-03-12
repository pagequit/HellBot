import type { RawTranslation } from "@/core/I18n.ts";

export default {
	description: () => "Erstellt eine einfache Umfrage.",
	subjects: () => "themen",
	subjectsDescription: () => "Mit Leerzeichen getrennte Liste von Themen.",
	replyExeption: () => "Es dürfen höchstens neun Themen angegeben werden.",
} satisfies RawTranslation;
