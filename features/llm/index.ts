import { ChannelType, Events, type Message } from "discord";
import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import chat from "./chat/chat.ts";
import { createChat, getChat } from "./chats.ts";
import { type User } from "./chat/user.schema.ts";
import { OptionType, type Result, teaCall } from "unwrap";

export default {
  setup(core: Core): void {
    core.addChatInputCommand(chat(core));

    core.client.on(Events.MessageCreate, (message: Message) => {
      if (message.author.bot || message.channel.type !== ChannelType.DM) {
        return;
      }

      const chat = getChat(message.author.id);
      if (chat.discriminant === OptionType.None) {
        const llmUser: Result<User, Error> = teaCall(
          JSON.parse,
          Deno.readTextFileSync(`${Deno.cwd()}/features/llm/chat/user.json`),
        );

        if (llmUser.isErr()) {
          core.logger.error(llmUser.unwrapErr().message, llmUser.unwrapErr());
          message.reply("An error occurred while loading user data.");

          return;
        }

        if (!llmUser.unwrap()[message.author.id]) {
          message.reply("No model selected, use `/chat` to select a model.");
          return;
        }

        chat.insert(
          createChat(llmUser.unwrap()[message.author.id], message.author.id),
        );
      }

      chat.unwrap().sendMessage(message.content).then((response) => {
        message.reply(response);
      }).catch((error) => {
        core.logger.error(error);
        message.reply("An error occurred while processing your request.");
      });
    });
  },
} satisfies Feature;
