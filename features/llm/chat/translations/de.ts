import type { RawTranslation } from "@/core/i18n/I18n.ts";

export default {
	name: () => "chat",
	description: () => "Wähle ein Modell um mit HellBot zu chatten.",
	disclaimer: () =>
		"ACHTUNG: Einige dieser Modelle gehören zu großen Tech-Konzernen die vielleicht mitlesen (OpenAI) und andere lesen definiv mit (Google).\n" +
		"'gemini-pro' -> Google (ACHTUNG: Ich habe gemini so eingestellt das es sich wie Marvin, der depressive kleine Roboter aus Per Anhalter durch die Galaxis, verhalten soll. Es kann sehr deprimierend sein mit diesem Modell zu chatten.)\n" +
		"'gpt-3.5-turbo' -> OpenAI (ChatGPT)\n" +
		"'mistral-7b' -> Läuft lokal, kann nur Englisch und ist sehr sehr langsam. Aber dafür privat.\n",
	select: () => "Wähle ein Modell:",
	confirmation: (model: string) => `${model} ausgewählt.`,
} satisfies RawTranslation;
