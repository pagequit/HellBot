import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";

const hellBot = new HellCore({ botlog, discord });
await hellBot.setup();
hellBot.login(discord.token);
