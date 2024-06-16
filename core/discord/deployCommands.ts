import { discord } from "@/config.ts";
import { REST, Routes, type SlashCommandBuilder } from "discord.js";
import { logger } from "./logger.ts";

const rest = new REST({ version: "10" }).setToken(discord.token);

export function deployApplicationCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  return rest
    .put(Routes.applicationCommands(discord.applicationId), { body })
    .then(() => logger.log("Successfully deployed all application commands."))
    .catch((error) => {
      logger.error(error.message, error);
    });
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
    .then(() => logger.log("Successfully deployed all guild commands."))
    .catch((error) => {
      logger.error(error.message, error);
    });
}

export async function removeAllSlashCommands() {
  await rest
    .put(
      Routes.applicationGuildCommands(discord.applicationId, discord.guildId),
      {
        body: [],
      },
    )
    .then(() => logger.log("Successfully removed all guild commands."))
    .catch((error) => {
      logger.error(error.message, error);
    });

  await rest
    .put(Routes.applicationCommands(discord.applicationId), {
      body: [],
    })
    .then(() => logger.log("Successfully removed all application commands."))
    .catch((error) => {
      logger.error(error.message, error);
    });
}
