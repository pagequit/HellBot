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
    console.log(feature);
    match(feature);
  }

  login(token: string) {
    this.client.login(token);
  }

  async loadFeatures() {
    for await (
      const feature of Deno.readDir(Deno.cwd() + "/features")
    ) {
      const module = await import(`../features/${feature.name}/index.ts`);
      this.use(module.default);
    }
  }
}

function match<T>(value: Feature): T {
  switch (value.tag) {
    case Plugin: {
      console.log("plugin");
      console.log(value);
      return value.name as T;
    }
    case Command: {
      console.log("command");
      console.log(value);
      return value.name as T;
    }
  }
}
