import HellCore from "/core/HellCore.ts";
import { discord } from "/config.ts";

new HellCore().login(discord.token);
