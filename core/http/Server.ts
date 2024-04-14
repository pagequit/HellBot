import { useCrappyStore } from "@/core/CrappyStore";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const crappyStore = useCrappyStore();

export default new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET as string,
    }),
  )
  .get("/auth/:token", async ({ jwt, set, cookie: { auth }, params }) => {
    const user = crappyStore.get(params.token);

    if (user.isNone()) {
      set.status = 401;
      return "Unauthorized";
    }

    auth.set({
      value: await jwt.sign({ id: user.unwrap() }),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: "/",
      secure: false, // FIXME for production
    });

    crappyStore.delete(params.token);

    return `Sign in as ${user.unwrap()}`;
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
  })
  .get("/", async ({ jwt, set, cookie: { auth } }) => {
    const user = await jwt.verify(auth.value);

    if (!user) {
      set.status = 401;
      return "Unauthorized";
    }
    return `Hello ${user.id}`;
  });
