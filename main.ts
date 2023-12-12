import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";
import ping from "./features/ping/index.ts";
import timer from "./features/timer/index.ts";

const hellBot = new HellCore({ botlog, discord });

hellBot.use(ping);
hellBot.use(timer);

hellBot.login(discord.token);
