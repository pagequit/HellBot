import { load } from "std/dotenv/mod.ts";
import OpenAI from "openai";

export default async function (promt: string): Promise<string> {
  const env = await load();
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY") ?? env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: promt }],
  });

  console.log(response);

  return String(response.choices[0].message.content);
}
