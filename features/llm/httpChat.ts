import { frontend, llama } from "@/config.ts";
import { createJwt } from "@/core/mod.ts";
import { Elysia, t } from "elysia";

const sampling = t.Object({
  temperature: t.Number({
    description: "Adjust the randomness of the generated text. Default: 0.8",
    minimum: 0.1,
    maximum: 2.0,
  }),
  top_k: t.Number({
    description:
      "Limit the next token selection to the K most probable tokens. Default: 40",
    minimum: 0, // use vocab size
    maximum: 100,
  }),
  top_p: t.Number({
    minimum: 0.1,
    maximum: 1.0, // disabled
  }),
  min_p: t.Number({
    minimum: 0.0, // disabled
    maximum: 1.0,
  }),
  n_predict: t.Number({
    minimum: -1, // infinite
    maximum: 1024,
  }),
  repeat_penalty: t.Number({
    minimum: 0.1,
    maximum: 2.0,
  }),
});

const completion = t.Object({
  prompt: t.String(),
  stream: t.Boolean(),
  stop: t.Array(t.String()),
});

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
