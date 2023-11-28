import HellCore from "/core/HellCore.ts";
import { discord } from "/config.ts";

const hellBot = new HellCore();
hellBot.login(discord.token);
// hellBot.setup();
await hellBot.loadFeatures(Deno.cwd() + "/features");
await hellBot.registerCommands();
