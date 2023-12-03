import type { APIMessage } from "discord";
import { EmbedBuilder, WebhookClient } from "discord";

export default class HellLog {
  client: WebhookClient;

  constructor(client: WebhookClient) {
    this.client = client;
  }

  log(message: string, ...payload: unknown[]): Promise<APIMessage> {
    console.log(message, ...payload);

    return this.client.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Log")
          .setColor(0xf2f3f5)
          .setDescription(message)
          .setTimestamp(new Date())
          .setURL("https://dash.deno.com/"),
      ],
    });
  }

  warn(message: string, ...payload: unknown[]): Promise<APIMessage> {
    console.warn(message, ...payload);

    return this.client.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Warn")
          .setColor(0xf0b232)
          .setDescription(message)
          .setTimestamp(new Date())
          .setURL("https://dash.deno.com/"),
      ],
    });
  }

  error(message: string, ...payload: unknown[]): Promise<APIMessage> {
    console.error(message, ...payload);

    return this.client.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Error")
          .setColor(0xf23f43)
          .setDescription(message)
          .setTimestamp(new Date())
          .setURL("https://dash.deno.com/"),
      ],
    });
  }
}
