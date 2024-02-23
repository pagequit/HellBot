export default class Chat {
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
