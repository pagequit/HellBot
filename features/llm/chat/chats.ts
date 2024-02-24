import { Collection, Ok, type Result } from "unwrap";
import { Model } from "../Model.ts";
import { type ChatBody } from "../ChatBody.ts";

export type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

class Chat {
  context: Array<Message>;
  sessionId: string;
  handle: (content: string) => void;

  constructor(sessionId: string, handle: Chat["handle"]) {
    this.context = [];
    this.sessionId = sessionId;
    this.handle = handle;
  }

  async sendMessage(content: string) {
    const response = await this.handle(content);
    // let reply = "";
    // if (response.isOK) {
    //   reply = response.body.text;
    // }

    // return reply;
  }
}

const chats = new Collection<string, Chat>();

const Mode: Record<Model, (sessionId: string) => Chat> = {
  [Model.Gemini]: (sessionId) => {
    const handler = () => {};
    return new Chat(sessionId, handler);
  },
  [Model.ChatGPT]: (sessionId) => {
    const handler = () => {};
    return new Chat(sessionId, handler);
  },
  [Model.Mistral]: (sessionId) => {
    const handler = () => {};
    return new Chat(sessionId, handler);
  },
};

export function createChat(model: Model, sessionId: string) {
  const chat = Mode[model](sessionId);
  chats.set(sessionId, chat);

  return chat;
}

export function getChat(sessionId: string) {
  return chats.get(sessionId);
}
