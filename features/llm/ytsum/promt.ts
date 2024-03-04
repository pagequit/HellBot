import { Err, Ok, Result } from "unwrap";

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
  // return postJSON(new URL("http://localhost:8000/completion"), {
  return postJSON(new URL("http://llm:8000/completion"), {
    n_predict: 256,
    temperature: 0.7,
    prompt,
  });
}
