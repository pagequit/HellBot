import "https://deno.land/std@0.197.0/dotenv/load.ts";
import { Client, Events, GatewayIntentBits } from "npm:discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: Client<true>) => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(Deno.env.get("token"));
