import HellCore from "/core/HellCore.ts";
import { discord } from "/config.ts";
import ping from "/feature/ping/index.ts";

const hellBot = new HellCore();

hellBot.use(ping);

hellBot.login(discord.token);
