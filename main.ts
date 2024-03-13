import { botlog, discord } from "@/config.ts";
import HellCore from "@/core/HellCore.ts";
import HellLog from "@/core/HellLog.ts";
import server from "@/core/http/Server";

new HellCore(new HellLog(botlog)).setup().then((hellBot) => {
	hellBot.login(discord.token);
});

server.listen(8080);
