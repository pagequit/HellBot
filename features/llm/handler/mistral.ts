import { type Message } from "../Message.ts";
import type Chat from "../Chat.ts";

function prompt(context: Array<Message>, content: string): string {
  return context.reduce((acc, cur, idx) => {
    return idx % 2 === 0
      ? `${acc}[INST] ${cur.content} [/INST]`
      : `${acc} ${cur.content}</s>`;
  }, "<s>") + `[INST] ${content} [/INST]`;
}

export function mistralCall(messages: Array<Message>): Promise<string> {
  return fetch("http://llm:8080/completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      temperature: 0.8,
      prompt: prompt(messages, messages[messages.length - 1].content),
    }),
  }).then((res) => res.json().then((json) => json.content));
}

export default async function (chat: Chat): Promise<string> {
  return await mistralCall(chat.context);
}
