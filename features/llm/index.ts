import { ChannelType, Events, type Message } from "discord";
import type { Core } from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import ytsum from "./ytsum/ytsum.ts";
import chat from "./gemini/gemini.ts";
import chatGPT from "./chatGPT/chatGPT.ts";
import gemini from "./gemini/gemini.ts";

export default {
  setup(core: Core): void {
    // core.addChatInputCommand(ytsum(core));
    // core.addChatInputCommand(chat);

    core.client.on(Events.MessageCreate, (message: Message) => {
      if (message.author.bot || message.channel.type !== ChannelType.DM) {
        return;
      }

      // chatGPT(message.content).then((response) => {
      //   message.reply(response);
      // });

      // gemini(message.author.id, message.content).then((response) => {
      //   message.reply(response.content);
      // });
    });
  },
} satisfies Feature;
