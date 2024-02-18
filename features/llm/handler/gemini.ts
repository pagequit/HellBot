import { type ChatBody } from "../ChatBody.ts";

export default function (
  sessionId: string,
  content: string,
): Promise<ChatBody> {
  return fetch("http://protonwire:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      content,
    }),
  }).then((res) => res.json() as Promise<ChatBody>);
}
