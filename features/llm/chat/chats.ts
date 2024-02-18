import { Collection, Ok, type Result } from "unwrap";
import { Model } from "../Model.ts";
import { type ChatBody } from "../ChatBody.ts";
import gemini from "../handler/gemini.ts";
import openAI from "../handler/openAI.ts";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const chats = new Collection<string, { sendMessage: typeof sendMessage }>();

async function sendMessage(
  this: Message[],
  content: string,
): Promise<Result<string, Error>> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  this.push({ role: "user", content });
  this.push({ role: "assistant", content: "Hello!" });

  return Ok(content);
}

const Mode: Record<
  Model,
  () => (sessionId: string, content: string) => Promise<ChatBody>
> = {
  [Model.Gemini]: googleChat,
  [Model.ChatGPT]: openAIChat,
  [Model.Mistral]: openAIChat,
};

function googleChat() {
  return gemini;
}

function openAIChat() {
  return openAIChat;
}

export function startChat(model: Model) {
  Mode[model]();

  const context: Message[] = [];

  return {
    sendMessage: sendMessage.bind(context),
  };
}

export function getChat(sessionId: string) {
  return chats.get(sessionId);
}
