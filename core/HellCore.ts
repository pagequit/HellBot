import "https://deno.land/std@0.197.0/dotenv/load.ts";
import { Client, Events, GatewayIntentBits } from "npm:discord.js@14.12.1";

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
