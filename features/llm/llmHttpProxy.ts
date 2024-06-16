import { FFIType, dlopen, suffix } from "bun:ffi";
import { llamaURL } from "@/config.ts";
import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse.ts";
import { createJwt } from "@/core/http/createJwt.ts";
import { Elysia } from "elysia";
import { completionRequestBody } from "./completionRequestBody.ts";
// import { parseFunctionCallables } from "./parseFunctionCallables.ts";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const path = `${process.cwd()}/features/llm/libfunction_call.${suffix}`;
const lib = dlopen(path, {
  parseFunctionCallables: {
    args: [FFIType.ptr, FFIType.u16],
    returns: FFIType.void,
  },
});

function pipe(stream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = stream.getReader();
  let leftover = "";
  let buffer = "";

  return new ReadableStream({
    start(controller) {
      return pump();
      async function pump(): Promise<void> {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        lib.symbols.parseFunctionCallables(value, value.length);

        const text = leftover + decoder.decode(value);
        const lines = text.split("\n");
        // @ts-ignore
        leftover = text.endsWith("\n") ? "" : lines.pop();

        for (const line of lines) {
          const message = line.trim();
          if (message.length === 0) {
            continue;
          }

          try {
            const data = JSON.parse(message.substring(5)); // "data: "
            buffer += data.content;
          } catch (error) {
            console.error(error, message);
          }

          controller.enqueue(value);

          buffer = "";
          return pump();
        }
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
