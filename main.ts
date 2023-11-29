import HellCore from "/core/HellCore.ts";
import { discord } from "/config.ts";
// import { deleteSlashCommands } from "./core/procedures/deleteSlashCommands.ts";

const hellBot = new HellCore();
hellBot.login(discord.token);
await hellBot.loadFeatures(Deno.cwd() + "/features");

// await deleteSlashCommands();

await hellBot.registerCommands();
