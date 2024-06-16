import { llamaURL } from "@/config.ts";
import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse.ts";
import { createJwt } from "@/core/http/createJwt.ts";
import { Elysia } from "elysia";
import { completionRequestBody } from "./completionRequestBody.ts";

function pipe(stream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = stream.getReader();
  return new ReadableStream({
    start(controller) {
      return pump();
      async function pump(): Promise<void> {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        console.log(value);
        controller.enqueue(value);
        return pump();
      }
    },
  });
}

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

      return pipe(response.body as ReadableStream<Uint8Array>);
    },
    {
      body: completionRequestBody,
    },
  );

export { llmHttpProxy };
