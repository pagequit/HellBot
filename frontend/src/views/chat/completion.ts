import type { CompletionRequestBody } from "@/features/llm/completionRequestBody.ts";
import { origin } from "@/frontend/src/composables/origin.ts";

export function makeCompletionRequest(
  requestBody: CompletionRequestBody,
  conttroller: AbortController,
): Promise<Response> {
  return fetch(`${origin}/completion`, {
    credentials: "include",
    mode: "cors",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    signal: conttroller.signal,
  });
}
