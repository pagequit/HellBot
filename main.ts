import HellCore from "/core/HellCore.ts";
import { discord } from "/config.ts";

const hellBot = new HellCore();
hellBot.login(discord.token);
