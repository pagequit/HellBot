import { load } from "std/dotenv/mod.ts";

const env = await load();

export const discord = {
  token: env.DISCORD_TOKEN,
  guildId: env.HELLNET_ID,
  clientId: env.HELLBOT_ID,
};
