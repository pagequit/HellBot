import { http, type Feature } from "@/core/mod.ts";
import { llmHttpProxy } from "./llmHttpProxy.ts";

export default ((): void => {
  http.use(llmHttpProxy);
}) satisfies Feature;
