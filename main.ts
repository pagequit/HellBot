import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";
import ping from "./features/ping/index.ts";

const hellBot = new HellCore({ botlog, discord });

await hellBot.use(ping);

hellBot.login(discord.token);
