import { frontend } from "@/config.ts";
import { createJwt, logger } from "@/core/mod.ts";
import { Elysia } from "elysia";
import { OptionType } from "unwrap/mod.ts";
import llmUsers from "./chat/user.json";
import type { User } from "./chat/user.schema.ts";
import { createChat, getChat } from "./chats.ts";

const httpChat = new Elysia({
  name: "chat",
})
  .use(createJwt)
  .post("/completion", async ({ jwt, set, cookie: { auth }, body }) => {
    const user = await jwt.verify(auth.value);
    if (!user) {
      set.status = 401;
      return "Unauthorized";
    }

    set.headers["Access-Control-Allow-Origin"] = frontend.origin;
    set.headers["Access-Control-Allow-Credentials"] = "true";

    return fetch(`${"http://localhost:8080"}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body as string,
    });
  })
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
      .sendMessage((JSON.parse(body as string) as { content: string }).content)
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

export { httpChat };
