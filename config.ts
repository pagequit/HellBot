// import { load } from "std/dotenv/mod.ts";

// const env = await load();

export const discord = {
  token: Deno.env.get("DISCORD_TOKEN")!,
  guildId: Deno.env.get("HELLNET_ID")!,
  clientId: Deno.env.get("HELLBOT_ID")!,
};

export const botlog = {
  id: Deno.env.get("BOTLOG_ID")!,
  token: Deno.env.get("BOTLOG_TOKEN")!,
};
