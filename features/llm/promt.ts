import { Err, Ok, Result } from "unwrap";
// import { load } from "std/dotenv/mod.ts";
// import OpenAI from "openai";

export function postJSON(
  url: URL,
  body: unknown,
): Promise<Result<string, Error>> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) =>
      res.json()
        .then((json) => Ok<string, Error>(json.content)) // TODO: add a type
        .catch((err) => Err<string, Error>(err))
    )
    .catch((err) => Err<string, Error>(err));
}

export default function (prompt: string): Promise<Result<string, Error>> {
  return postJSON(new URL("http://localhost:8000/completion"), {
    n_predict: 256,
    temperature: 0.7,
    prompt,
  });
}

// export default async function (promt: string): Promise<Result<string, Error>> {
//   const env = await load();
//   const openai = new OpenAI({
//     apiKey: Deno.env.get("OPENAI_API_KEY") ?? env.OPENAI_API_KEY,
//   });

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: promt }],
//   });

//   return Ok(response.choices[0].message?.content ?? "");
// }
