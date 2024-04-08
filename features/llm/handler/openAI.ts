import OpenAI from "openai";
import type Chat from "../Chat.ts";
import type { Message } from "../Message.ts";

export async function openAICall(messages: Array<Message>): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
