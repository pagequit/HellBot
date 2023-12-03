import { load } from "std/dotenv/mod.ts";

const env = await load();

export const path = {
  features: `${Deno.cwd()}/${env.FEATURES_PATH}`,
};

console.log(path.features);

export const discord = {
  token: env.DISCORD_TOKEN,
  guildId: env.HELLNET_ID,
  clientId: env.HELLBOT_ID,
};

export const botlog = {
  id: env.BOTLOG_ID,
  token: env.BOTLOG_TOKEN,
};
