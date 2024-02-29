import type { Message } from "./Message.ts";

export default class Chat {
  sessionId: string;
  context: Array<Message>;
  handle: (context: Chat["context"]) => Promise<string>;

  constructor(sessionId: string, handle: Chat["handle"]) {
    this.sessionId = sessionId;
    this.context = [];
    this.handle = handle;
  }

  async sendMessage(content: string) {
    this.context.push({ role: "user", content });

    // handle error?
    const response = await this.handle(this.context);

    this.context.push({ role: "assistant", content: response });

    console.log(this.context);
    return response;
  }
}
