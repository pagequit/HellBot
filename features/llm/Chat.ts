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

    let response = "An error occurred.";
    try {
      response = await this.handle(this);
      this.context.push({ role: "assistant", content: response });
    } catch (error) {
      this.context.pop();
      console.error(error);

      // the error is handled by the caller
      // FIXME: this sucks
      throw error;
    }

    return response;
  }
}
