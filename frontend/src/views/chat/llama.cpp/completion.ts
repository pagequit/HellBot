import type { CompletionRequestBody } from "@/features/llm/completionRequestBody.ts";
import { origin } from "@/frontend/src/composables/origin.ts";

export function makePrompt(
  body: CompletionRequestBody,
  conttroller: AbortController,
): Promise<Response> {
  return fetch(`${origin}/completion`, {
    credentials: "include",
    mode: "cors",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: conttroller.signal,
  });
}
