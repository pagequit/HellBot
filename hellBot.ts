import "https://deno.land/std@0.197.0/dotenv/load.ts";
import { Client, Events, GatewayIntentBits } from "npm:discord.js@14.12.1";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: Client<true>) => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(Deno.env.get("token"));
