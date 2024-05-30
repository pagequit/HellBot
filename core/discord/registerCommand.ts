import { Err, Ok, type Result } from "unwrap/mod.ts";
import type { ChatInputCommand } from "./ChatInputCommand.ts";
import {
  chatInputCommands,
  chatInputGuildCommands,
} from "./chatInputCommands.ts";
import { logger } from "./logger.ts";

export function registerChatInputGuildCommand(
  command: ChatInputCommand,
): Result<undefined, Error> {
  if (chatInputGuildCommands.has(command.data.name)) {
    const error = new Error(
      `Guild command '${command.data.name}' already registered.`,
    );
    logger.error(error.message, error);

    return Err(error);
  }
  chatInputGuildCommands.set(command.data.name, command);
  logger.log(
    `Guild command "/${command.data.name}" registered.`,
    command.data.name,
  );

  return Ok(undefined);
}

export function registerChatInputCommand(
  command: ChatInputCommand,
): Result<undefined, Error> {
  if (chatInputCommands.has(command.data.name)) {
    const error = new Error(
      `Command '${command.data.name}' already registered.`,
    );
    logger.error(error.message, error);

    return Err(error);
  }
  chatInputCommands.set(command.data.name, command);
  logger.log(`Command "/${command.data.name}" registered.`, command.data.name);

  return Ok(undefined);
}
