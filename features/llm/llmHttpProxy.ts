import { llamaURL } from "@/config.ts";
import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse.ts";
import { createJwt } from "@/core/http/createJwt.ts";
import { parseStreamToCompletionResult } from "@/features/llm/parseStreamToCompletionResult.ts";
import { Elysia } from "elysia";
import { Collection } from "unwrap/mod.ts";
import { completionRequestBody } from "./completionRequestBody.ts";

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

        return {
          errors: [
            {
              status: set.status,
              title: "Unauthorized",
            },
          ],
        } satisfies HttpJsonResponse;
      }

      const response = await fetch(`${llamaURL.origin}/completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream: true, ...body }),
      });

      return parseStreamToCompletionResult(
        response.body as ReadableStream<Uint8Array>,
        Collection.from([
          [
            "set_timer",
            ({ minutes, subject }: { minutes: number; subject: string }) => {
              return `{"name": "set_timer", "content": { "minutes": ${minutes}, "subject": "${subject}" }}`;
            },
          ],
        ]),
      );
    },
    {
      body: completionRequestBody,
    },
  );

export { llmHttpProxy };
