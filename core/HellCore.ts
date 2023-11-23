import { Client, Events, GatewayIntentBits } from "discord";
import type { Feature } from "./Feature.ts";
import Plugin from "./Plugin.ts";
import Command from "./Command.ts";

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

  use(feature: Feature) {
    const name = match<string>(feature);
  }

  login(token: string) {
    this.client.login(token);
  }
}

function match<T>(value: Feature): T {
  switch (value.tag) {
    case Plugin: {
      return value.name as T;
    }
    case Command: {
      return value.name as T;
    }
  }
}
