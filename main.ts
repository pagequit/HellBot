import HellCore from "./core/HellCore.ts";
new HellCore().login(`${Deno.env.get("DISCORD_TOKEN")}`);
