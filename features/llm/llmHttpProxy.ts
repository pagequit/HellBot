import { llamaURL } from "@/config.ts";
import { createJwt } from "@/core/mod.ts";
import { Elysia } from "elysia";
import { completionRequestBody } from "./completionRequestBody";

const llmHttpProxy = new Elysia({
  name: "llmHttpProxy",
})
  .use(createJwt)
  .post(
    "/completion",
    async ({ jwt, set, cookie: { auth }, body }) => {
      const user = await jwt.verify(auth.value);
      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      return fetch(`${llamaURL.origin}/completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    {
      body: completionRequestBody,
    },
  );

export { llmHttpProxy };
