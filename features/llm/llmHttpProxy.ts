// import { FFIType, dlopen, suffix } from "bun:ffi";
import { llamaURL } from "@/config.ts";
import type { HttpJsonResponse } from "@/core/http/HttpJsonResponse.ts";
import { createJwt } from "@/core/http/createJwt.ts";
import { Elysia } from "elysia";
import { completionRequestBody } from "./completionRequestBody.ts";

// const path = `${process.cwd()}/features/llm/libfunction_call.${suffix}`;
// const lib = dlopen(path, {
//   parseFunctionCallables: {
//     args: [FFIType.ptr, FFIType.u16],
//     returns: FFIType.void,
//   },
// });

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

      return fetch(`${llamaURL.origin}/completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream: true, ...body }),
      });
    },
    {
      body: completionRequestBody,
    },
  );

export { llmHttpProxy };
