import {
  http,
  type Feature,
  client,
  logger,
  registerChatInputCommand,
} from "@/core/mod.ts";
import { ChannelType, Events, type Message } from "discord.js";
import { OptionType } from "unwrap/mod.ts";
import { chat } from "./chat/chat.ts";
import llmUsers from "./chat/user.json";
import type { User } from "./chat/user.schema.ts";
import { createChat, getChat } from "./chats.ts";
import { llmHttpProxy } from "./llmHttpProxy.ts";

export default ((): void => {
  registerChatInputCommand(chat);
  http.use(llmHttpProxy);

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || message.channel.type !== ChannelType.DM) {
      return;
    }

    const m = await message.reply("...");

    const chat = getChat(message.author.id);
    if (chat.discriminant === OptionType.None) {
      const user = (llmUsers as User)[message.author.id];
      if (!user) {
        m.edit("No model selected, use `/chat` to select a model.");
        return;
      }

      chat.insert(createChat(user, message.author.id));
    }

    chat
      .unwrap()
      .sendMessage(message.content)
      .then((response) => {
        m.edit(response);
      })
      .catch((error) => {
        logger.error(error.message, error);
        m.edit("An error occurred while processing your request.");
      });
  });
}) satisfies Feature;
