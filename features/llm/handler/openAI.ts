import { load } from "std/dotenv/mod.ts";
import OpenAI from "openai";
import { type Message } from "../Message.ts";
import type Chat from "../Chat.ts";

// TODO: test sub .env files
const env = await load();

export async function openAICall(messages: Array<Message>): Promise<string> {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY") ?? env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    messages,
  });

  return String(response.choices[0].message.content);
}

export default function (chat: Chat): Promise<string> {
  return openAICall(chat.context);
}
