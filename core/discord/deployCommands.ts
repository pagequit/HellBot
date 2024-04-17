import { discord } from "@/config.ts";
import { REST, Routes, type SlashCommandBuilder } from "discord.js";

const rest = new REST({ version: "10" }).setToken(discord.token);

export function deployApplicationCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  return rest
    .put(Routes.applicationCommands(discord.clientId), { body })
    .then(() =>
      console.log("Successfully registered all application commands."),
    )
    .catch(console.error);
}

export function deployApplicationGuildCommands(
  commands: SlashCommandBuilder[],
): Promise<void> {
  const body = commands.map((c) => c.toJSON());

  return rest
    .put(Routes.applicationGuildCommands(discord.clientId, discord.guildId), {
      body,
    })
    .then(() => console.log("Successfully registered all guild commands."))
    .catch(console.error);
}
