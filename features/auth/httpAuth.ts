import { frontendURL } from "@/config.ts";
import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse";
import { client, createJwt, logger, store } from "@/core/mod.ts";
import type { Guild } from "discord.js";
import { Elysia } from "elysia";

const maxAge = 7 * 86400;
const rootPath = "/";
const isSecure = process.env.JWT_SECURE === "true";

const httpAuth = new Elysia({
  name: "auth",
})
  .use(createJwt())
  .get("auth/:token", async ({ jwt, set, cookie: { auth }, params }) => {
    const userId = store.get(params.token);

    if (userId.isNone()) {
      set.status = 401;

      return {
        errors: [
          {
            status: set.status,
            title: "Unauthorized",
          },
        ],
      } satisfies HttpJsonResponse;
    }

    auth.set({
      value: await jwt.sign({ id: userId.unwrap() }),
      httpOnly: true,
      maxAge: maxAge,
      path: rootPath,
      secure: isSecure,
    });

    store.delete(params.token);

    set.redirect = frontendURL.origin;
  })
  .get("auth/user", async ({ jwt, set, cookie: { auth } }) => {
    const user = await jwt.verify(auth.value);
    if (!user) {
      set.status = 401;

      return {
        errors: [
          {
            status: set.status,
            title: "Unauthorized",
          },
        ],
      } satisfies HttpJsonResponse;
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

      return {
        errors: [
          {
            status: set.status,
            title: "Not Found",
          },
        ],
      } satisfies HttpJsonResponse;
    }

    auth.set({
      value: await jwt.sign({ id: user.id }),
      httpOnly: true,
      maxAge: maxAge,
      path: rootPath,
      secure: isSecure,
    });

    return {
      data: {
        avatarURL: member.displayAvatarURL(),
        displayName: member.displayName,
      },
    } satisfies HttpJsonResponse;
  })
  .get("auth/logout", async ({ jwt, set, cookie: { auth } }) => {
    const user = await jwt.verify(auth.value);
    if (!user) {
      set.status = 401;

      return {
        errors: [
          {
            status: set.status,
            title: "Unauthorized",
          },
        ],
      } satisfies HttpJsonResponse;
    }

    auth.set({
      value: await jwt.sign({ id: user.id }),
      httpOnly: true,
      maxAge: 0,
      path: rootPath,
      secure: isSecure,
    });

    set.redirect = frontendURL.origin;
  });

export { httpAuth };
