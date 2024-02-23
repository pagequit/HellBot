import { Collection, Ok, type Result } from "unwrap";
import { Model } from "../Model.ts";
import { type ChatBody } from "../ChatBody.ts";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

class Chat {
  sessionId: string;
  handler: () => void;
  context: Array<Message>;

  constructor(sessionId: string, handler: Chat["handler"]) {
    this.sessionId = sessionId;
    this.handler = handler;
    this.context = [];
  }

  async sendMessage(content: string) {
    const response = await this.handler.sendMessage(content);
    let reply = "";
    if (response.isOK) {
      reply = response.body.text;
    }

    return reply;
  }
}

const chats = new Collection<string, Chat>();

const Mode: Record<Model, (sessionId: string) => Chat> = {
  [Model.Gemini]: (sessionId) => {
    return new Chat(sessionId);
  },
  [Model.ChatGPT]: (sessionId) => {
    return new Chat(sessionId);
  },
  [Model.Mistral]: (sessionId) => {
    return new Chat(sessionId);
  },
};

export function startChat(model: Model, sessionId: string) {
  const chat = Mode[model](sessionId);
  chats.set(sessionId, chat);

  return chat;
}

export function getChat(sessionId: string) {
  return chats.get(sessionId);
}
