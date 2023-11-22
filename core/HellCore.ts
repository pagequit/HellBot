import { Client, Events, GatewayIntentBits } from "discord";

export default class HellCore {
  client: Client;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      console.log(`Logged in as ${client.user.tag}`);
    });
  }

  login(token: string) {
    this.client.login(token);
  }
}
