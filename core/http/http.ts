import { Elysia } from "elysia";
import { createCors } from "./createCors.ts";

const http = new Elysia({
  name: "http",
}).use(createCors());

export { http };
