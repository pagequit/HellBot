import { frontend } from "@/config.ts";
import type { Feature } from "@/core/Feature.ts";
import {
  http,
  client,
  logger,
  registerChatInputGuildCommand,
} from "@/core/mod.ts";
import { store } from "@/core/store.ts";
import { jwt } from "@elysiajs/jwt";
import type { Guild } from "discord.js";
import { auth } from "./auth.ts";

export default ((): void => {
  registerChatInputGuildCommand(auth);

  http
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET as string,
      }),
    )
    .get("/user", async ({ jwt, set, cookie: { auth } }) => {
      const user = await jwt.verify(auth.value);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      const guild = (await client.guilds
        .fetch(process.env.HELLNET_ID as string)
        .catch((error) => {
          logger.error(error.message, error);
        })) as Guild;

      const member = await guild.members.fetch(String(user.id));

      auth.set({
        value: await jwt.sign({ id: user.id }),
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/",
        secure: false, // FIXME for production
      });

      set.status = 200;
      set.headers["Access-Control-Allow-Origin"] = frontend.origin;
      set.headers["Access-Control-Allow-Credentials"] = "true";

      return {
        data: {
          avatarURL: member?.displayAvatarURL(),
          displayName: member?.displayName,
        },
      };
    })
    .get("/auth/:token", async ({ jwt, set, cookie: { auth }, params }) => {
      const userId = store.get(params.token);

      if (userId.isNone()) {
        set.status = 401;
        return "Unauthorized";
      }

      auth.set({
        value: await jwt.sign({ id: userId.unwrap() }),
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/",
        secure: false, // FIXME for production
      });

      store.delete(params.token);

      set.redirect = frontend.origin;
    })
    .get("/logout", async ({ jwt, set, cookie: { auth } }) => {
      const user = await jwt.verify(auth.value);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      auth.set({
        value: await jwt.sign({ id: user.id }),
        httpOnly: true,
        maxAge: 0,
        path: "/",
        secure: false, // FIXME for production
      });

      return `Bye ${user.id}`;
    });
}) satisfies Feature;
