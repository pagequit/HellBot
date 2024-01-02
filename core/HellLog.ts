import { EmbedBuilder, WebhookClient, type WebhookClientData } from "discord";

export type HellLogger = {
  log(message: string, ...payload: unknown[]): void;
  warn(message: string, ...payload: unknown[]): void;
  error(message: string, ...payload: unknown[]): void;
};

export default class HellLog {
  client: WebhookClient;

  constructor(data: WebhookClientData) {
    this.client = new WebhookClient(data);
  }

  log(message: string, ...payload: unknown[]): void {
    console.log(message, ...payload);

    this.client.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf2f3f5)
          .setDescription(message),
      ],
    }).catch(console.error);
  }

  warn(message: string, ...payload: unknown[]): void {
    console.warn(message, ...payload);

    this.client.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf0b232)
          .setDescription(message),
      ],
    }).catch(console.error);
  }

  error(message: string, ...payload: unknown[]): void {
    console.error(message, ...payload);

    this.client.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf23f43)
          .setDescription(message),
      ],
    }).catch(console.error);
  }
}
