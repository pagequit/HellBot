import type { RawTranslation } from "@/core/i18n/I18n.ts";

export default {
  name: () => "chat",
  description: () => "Select a model to chat with HellBot.",
  disclaimer: () =>
    "ATTENTION: Some of these models belong to big tech companies that may be reading along (OpenAI) and others are definitely reading along (Google).\n" +
    "'gemini-pro' -> Google (ATTENTION: I have set gemini to behave like Marvin, the depressed little robot from The Hitchhiker's Guide to the Galaxy. It can be very depressing to chat with this model.)\n" +
    "'gpt-3.5-turbo' -> OpenAI (ChatGPT)\n" +
    "'mistral-7b' -> Runs locally, English only and is very, very slow. But private.\n",
  select: () => "Select a model:",
  confirmation: (model: string) => `${model} selected.`,
} satisfies RawTranslation;
