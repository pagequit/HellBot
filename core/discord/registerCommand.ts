import { Err, Ok, type Result } from "unwrap/mod.ts";
import type { ChatInputCommand } from "./ChatInputCommand.ts";
import {
  chatInputCommands,
  chatInputGuildCommands,
} from "./chatInputCommands.ts";
import { logger } from "./logger.ts";

export function registerChatInputGuildCommand(
  command: ChatInputCommand,
): Result<undefined, string> {
  if (chatInputGuildCommands.has(command.data.name)) {
    const error = `Guild command '${command.data.name}' already registered.`;
    logger.error(error);

    return Err(error);
  }
  chatInputGuildCommands.set(command.data.name, command);

  return Ok(undefined);
}

export function registerChatInputCommand(
  command: ChatInputCommand,
): Result<undefined, string> {
  if (chatInputCommands.has(command.data.name)) {
    const error = `Command '${command.data.name}' already registered.`;
    logger.error(error);

    return Err(error);
  }
  chatInputCommands.set(command.data.name, command);

  return Ok(undefined);
}
