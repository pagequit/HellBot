import { ChannelType, Events, type Message } from "discord";
import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import chat from "./chat/chat.ts";
import { getChat } from "./chat/chats.ts";
import { Option } from "unwrap";

export default {
  setup(core: Core): void {
    core.addChatInputCommand(chat(core));

    core.client.on(Events.MessageCreate, (message: Message) => {
      if (message.author.bot || message.channel.type !== ChannelType.DM) {
        return;
      }

      const chat = getChat(message.author.id);
      if (chat.isNone()) {
        message.reply("No model selected, use `/chat` to select a model.");
        return;
      }

      chat.unwrap().sendMessage(message).then((response) => {
        if (response.isErr()) {
          message.reply(response.unwrapErr().message);
        }

        message.reply(response.unwrap());
      }).catch((error) => {
        core.logger.error(error);
        message.reply("An error occurred while processing your request.");
      });
    });
  },
} satisfies Feature;
