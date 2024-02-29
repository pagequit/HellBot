import { load } from "std/dotenv/mod.ts";
import OpenAI from "openai";
import { type Message } from "../Message.ts";

export default async function (messages: Array<Message>): Promise<string> {
  const env = await load();
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
