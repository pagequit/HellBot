import { Collection } from "unwrap/mod.ts";
import type { ChatInputCommand } from "./ChatInputCommand.ts";

const chatInputCommands = new Collection<string, ChatInputCommand>();
const chatInputGuildCommands = new Collection<string, ChatInputCommand>();

export { chatInputCommands, chatInputGuildCommands };
