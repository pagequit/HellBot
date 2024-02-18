import { Collection, Ok, type Result } from "unwrap";
import { Model } from "../Model.ts";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type ChatBody = {
  sessionId: string;
  content: string;
};

const chats = new Collection<
  ChatBody["sessionId"],
  { sendMessage: typeof sendMessage }
>();

async function sendMessage(
  this: Message[],
  content: string,
): Promise<Result<string, Error>> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  this.push({ role: "user", content });
  this.push({ role: "assistant", content: "Hello!" });

  return Ok(content);
}

const Mode: Record<Model, () => void> = {
  [Model.Gemini]: googleChat,
  [Model.ChatGPT]: openAIChat,
  [Model.Mistral]: openAIChat,
};

function googleChat() {}

function openAIChat() {}

export function startChat(model: Model) {
  Mode[model]();

  const context: Message[] = [];

  return {
    sendMessage: sendMessage.bind(context),
  };
}
