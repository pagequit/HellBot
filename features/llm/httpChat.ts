import { frontend, llama } from "@/config.ts";
import { createJwt } from "@/core/mod.ts";
import { Elysia } from "elysia";

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

    return fetch(`${llama.origin}/completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body as string,
    });
  });

export { httpChat };
