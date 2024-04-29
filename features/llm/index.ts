import { frontend } from "@/config.ts";
import {
  http,
  type Feature,
  client,
  logger,
  registerChatInputCommand,
  useJwt,
} from "@/core/mod.ts";
import { ChannelType, Events, type Message } from "discord.js";
import { OptionType } from "unwrap/mod.ts";
import { chat } from "./chat/chat.ts";
import llmUsers from "./chat/user.json";
import type { User } from "./chat/user.schema.ts";
import { createChat, getChat } from "./chats.ts";

export default ((): void => {
  registerChatInputCommand(chat);

  http
    .use(useJwt())
    .post("/chat", async ({ jwt, set, cookie: { auth }, body }) => {
      const user = await jwt.verify(auth.value);
      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      const response = {
        status: 500,
        value: "An unexpected error occurred.",
      };

      const userId = String(user.id);
      const chat = getChat(userId);
      if (chat.discriminant === OptionType.None) {
        const llmUser = (llmUsers as User)[userId];
        if (!user) {
          response.value =
            "No model selected, use the `/chat` command in Discord, to select a model.";
        }

        chat.insert(createChat(llmUser, userId));
      }

      await chat
        .unwrap()
        .sendMessage(
          (JSON.parse(body as string) as { content: string }).content,
        )
        .then((res) => {
          response.status = 200;
          response.value = res;
        })
        .catch((error) => {
          logger.error(error.message, error);
          response.status = 502;
          response.value = "An error occurred while processing your request.";
        });

      set.status = response.status;
      set.headers["Access-Control-Allow-Origin"] = frontend.origin;
      set.headers["Access-Control-Allow-Credentials"] = "true";

      return {
        data: response,
      };
    });

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
