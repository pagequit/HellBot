import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";
import HellLog from "/core/HellLog.ts";

new HellCore(new HellLog(botlog)).setup().then((hellBot) => {
  hellBot.login(discord.token);
});
