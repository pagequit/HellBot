import type { SlashCommandBuilder } from "discord";
import { REST, Routes } from "discord";
import { discord } from "/config.ts";

export async function registerSlashCommands(commands: SlashCommandBuilder[]) {
  const rest = new REST({ version: "10" }).setToken(discord.token);

  await rest.put(
    Routes.applicationGuildCommands(discord.clientId, discord.guildId),
    {
      body: commands,
    },
  )
    .then(() => console.log("Successfully deleted all guild commands."))
    .catch(console.error);

  await rest.put(Routes.applicationCommands(discord.clientId), {
    body: commands,
  })
    .then(() => console.log("Successfully deleted all application commands."))
    .catch(console.error);
}
