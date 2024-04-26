import { discord } from "@/config.ts";
import { REST, Routes, type SlashCommandBuilder } from "discord.js";

const rest = new REST({ version: "10" }).setToken(discord.token);

export function deployApplicationCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  return rest
    .put(Routes.applicationCommands(discord.applicationId), { body })
    .then(() => console.log("Successfully deployed all application commands."))
    .catch(console.error);
}

export function deployApplicationGuildCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  return rest
    .put(
      Routes.applicationGuildCommands(discord.applicationId, discord.guildId),
      {
        body,
      },
    )
    .then(() => console.log("Successfully deployed all guild commands."))
    .catch(console.error);
}

export async function removeAllSlashCommands() {
  await rest
    .put(
      Routes.applicationGuildCommands(discord.applicationId, discord.guildId),
      {
        body: [],
      },
    )
    .then(() => console.log("Successfully removed all guild commands."))
    .catch(console.error);

  await rest
    .put(Routes.applicationCommands(discord.applicationId), {
      body: [],
    })
    .then(() => console.log("Successfully removed all application commands."))
    .catch(console.error);
}
