import { frontendURL } from "@/config.ts";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const http = new Elysia({
  name: "http",
}).use(
  cors({
    // https://github.com/elysiajs/elysia-cors/issues/41
    origin: frontendURL.host,
    allowedHeaders: ["Content-Type"],
    credentials: true,
    preflight: true,
  }),
);

export { http };
