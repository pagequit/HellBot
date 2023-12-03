import { load } from "std/dotenv/mod.ts";

const env = await load();

export const path = {
  features: `${Deno.cwd()}/${
    env.FEATURES_PATH ?? Deno.env.get("FEATURES_PATH")
  }`,
};

export const discord = {
  token: env.DISCORD_TOKEN ?? Deno.env.get("DISCORD_TOKEN"),
  guildId: env.HELLNET_ID ?? Deno.env.get("HELLNET_ID"),
  clientId: env.HELLBOT_ID ?? Deno.env.get("HELLBOT_ID"),
};

export const botlog = {
  id: env.BOTLOG_ID ?? Deno.env.get("BOTLOG_ID"),
  token: env.BOTLOG_TOKEN ?? Deno.env.get("BOTLOG_TOKEN"),
};
