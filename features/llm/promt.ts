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
        .then((json) => Ok<string, Error>(json))
        .catch((err) => Err<string, Error>(err))
    )
    .catch((err) => Err<string, Error>(err));
}

export default function (prompt: string): Promise<Result<string, Error>> {
  return postJSON(
    new URL("http://localhost:11434/api/generate"),
    {
      model: "mistral",
      stream: false,
      prompt,
    },
  );
}
