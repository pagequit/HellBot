import { botlog, discord } from "@/config.ts";
import HellCore from "@/core/HellCore.ts";
import HellLog from "@/core/HellLog.ts";

new HellCore(new HellLog(botlog)).setup().then((hellBot) => {
  hellBot.client.login(discord.token);
  hellBot.server.listen(8080);
});
