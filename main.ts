import HellCore from "/core/HellCore.ts";
import { botlog, discord, path } from "/config.ts";
// import { deleteSlashCommands } from "./core/procedures/deleteSlashCommands.ts";

const hellBot = new HellCore({ botlog });
hellBot.login(discord.token);
await hellBot.loadFeatures(Deno.cwd() + "/" + path.features);

// await deleteSlashCommands();

// await hellBot.registerCommands();
