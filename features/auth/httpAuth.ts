import { frontendURL } from "@/config.ts";
import { client, createJwt, logger } from "@/core/mod.ts";
import { store } from "@/core/store.ts";
import type { Guild } from "discord.js";
import { Elysia } from "elysia";

const httpAuth = new Elysia({
  name: "auth",
})
  .use(createJwt())
  .get("auth/:token", async ({ jwt, set, cookie: { auth }, params }) => {
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
      secure: false, // FIXME: for production
    });

    store.delete(params.token);

    set.redirect = frontendURL.origin;
  })
  .get("auth/user", async ({ jwt, set, cookie: { auth } }) => {
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

    const member = await guild.members.fetch(String(user.id)).catch((error) => {
      logger.error(error.message, error);
    });

    if (!member) {
      set.status = 404;
      return "Not Found";
    }

    auth.set({
      value: await jwt.sign({ id: user.id }),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: "/",
      secure: false, // FIXME: for production
    });

    return {
      data: {
        avatarURL: member.displayAvatarURL(),
        displayName: member.displayName,
      },
    };
  })
  .get("auth/logout", async ({ jwt, set, cookie: { auth } }) => {
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
      secure: false, // FIXME: for production
    });

    return `Bye ${user.id}`;
  });

export { httpAuth };
