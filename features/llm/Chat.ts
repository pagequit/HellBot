import type { Message } from "./Message.ts";

export default class Chat {
  sessionId: string;
  sendMessage: (content: string) => Promise<string>;
  context: Array<Message>;

  constructor(sessionId: string, sendMessage: Chat["sendMessage"]) {
    this.sessionId = sessionId;
    this.sendMessage = sendMessage;
    this.context = [];
  }
}
