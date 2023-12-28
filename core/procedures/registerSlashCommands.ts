import type { SlashCommandBuilder } from "discord";
import { REST, Routes } from "discord";
import { discord } from "/config.ts";

const rest = new REST({ version: "10" }).setToken(discord.token);

export async function registerCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  await rest.put(
    Routes.applicationCommands(discord.clientId),
    { body },
  ).then(() => console.log("Successfully registered all application commands."))
    .catch(console.error);
}

export async function registerGuildCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(discord.clientId, discord.guildId),
    { body },
  ).then(() => console.log("Successfully registered all guild commands."))
    .catch(console.error);
}
