import "std/dotenv/load.ts";
import { Client, Events, GatewayIntentBits } from "discord";

export default class HellCore {
  client: Client;

  constructor(token: string) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.login(token);
  }
}
