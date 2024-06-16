import type { Feature } from "@/core/Feature.ts";
import { http } from "@/core/http/http.ts";
import { llmHttpProxy } from "./llmHttpProxy.ts";

export default ((): void => {
  http.use(llmHttpProxy);
}) satisfies Feature;
