import { Collection } from "unwrap";
import { Model } from "./Model.ts";
import Chat from "./Chat.ts";
import openAIHandler from "./handler/openAI.ts";
import geminiHandler from "./handler/gemini.ts";

const chats = new Collection<string, Chat>();

const Mode: Record<Model, (sessionId: string) => Chat> = {
  [Model.Gemini]: (sessionId) => {
    return new Chat(sessionId, geminiHandler);
  },
  [Model.ChatGPT]: (sessionId) => {
    return new Chat(sessionId, openAIHandler);
  },
  [Model.Mistral]: (sessionId) => {
    return new Chat(sessionId, () => {
      return Promise.resolve("WIP");
    });
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
