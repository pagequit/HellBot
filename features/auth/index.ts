import type { Feature } from "@/core/Feature.ts";
import { http, registerChatInputGuildCommand } from "@/core/mod.ts";
import { store } from "@/core/store.ts";
import { jwt } from "@elysiajs/jwt";
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
    .get("/", async ({ jwt, set, cookie: { auth } }) => {
      const user = await jwt.verify(auth.value);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      set.status = 200;
      set.headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
      set.headers["Access-Control-Allow-Credentials"] = "true";

      return {
        id: user.id,
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

      // return `Sign in as ${userId.unwrap()}`;
      set.redirect = "http://localhost:5173";
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
