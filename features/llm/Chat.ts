import type { Message } from "./Message.ts";

export default class Chat {
  sessionId: string;
  context: Array<Message>;
  handle: (chat: this) => Promise<string>;

  constructor(sessionId: string, handle: Chat["handle"]) {
    this.sessionId = sessionId;
    this.context = [];
    this.handle = handle;
  }

  async sendMessage(content: string) {
    this.context.push({ role: "user", content });

    // handle error?
    const response = await this.handle(this);
    console.log(response);

    this.context.push({ role: "assistant", content: response });

    console.log(this.context);
    return response;
  }
}
