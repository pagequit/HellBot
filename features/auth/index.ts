import { frontend } from "@/config.ts";
import type { Feature } from "@/core/Feature.ts";
import {
  http,
  client,
  logger,
  registerChatInputGuildCommand,
  useJwt
} from "@/core/mod.ts";
import { store } from "@/core/store.ts";
import type { Guild } from "discord.js";
import { Elysia } from "elysia";
import { auth } from "./auth.ts";

function createHttpAuth({ prefix }: { prefix: string }): Elysia {
  return new Elysia({
    name: "auth",
  })
    .use(useJwt())
    .get(`${prefix}/:token`, async ({ jwt, set, cookie: { auth }, params }) => {
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
    .get(`${prefix}/user`, async ({ jwt, set, cookie: { auth } }) => {
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
    .get(`${prefix}/logout`, async ({ jwt, set, cookie: { auth } }) => {
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
}

export default ((): void => {
  registerChatInputGuildCommand(auth);
  http.use(createHttpAuth({ prefix: "/auth" }));
}) satisfies Feature;
