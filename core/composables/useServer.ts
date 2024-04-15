import { useStore } from "@/core/composables/useStore.ts";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const store = useStore();
const server = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET as string,
    }),
  )
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

    return `Sign in as ${userId.unwrap()}`;
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

export function useServer(): Elysia {
  return server;
}
