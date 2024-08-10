import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse.ts";
import { createJwt } from "@/core/http/createJwt.ts";
import { parseStreamToCompletionResult } from "@/features/llm/parseStreamToCompletionResult.ts";
import { Elysia } from "elysia";
import { Collection } from "unwrap/mod.ts";
import { completionRequest } from "./completionRequest.ts";
import { completionRequestBody } from "./completionRequestBody.ts";
import { set_timer } from "./functions/set_timer.ts";

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

      const response = await completionRequest(body);

      return parseStreamToCompletionResult(
        response.body as ReadableStream<Uint8Array>,
        body,
        Collection.from([["set_timer", set_timer]]),
      );
    },
    {
      body: completionRequestBody,
    },
  );

export { llmHttpProxy };
