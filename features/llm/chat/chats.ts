import { Collection, Ok, type Result } from "unwrap";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type ChatBody = {
  sessionId: string;
  content: string;
};

const chats = new Collection<string, { sendMessage: typeof sendMessage }>();

async function sendMessage(content: string): Promise<Result<string, Error>> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return Ok(content);
}

enum Model {
  Gemini = "gemini-pro",
  ChatGPT = "gpt-3.5-turbo",
  Mistral = "mistral-7b",
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
