import { llamaURL } from "@/config";
import type { CompletionRequestBody } from "./completionRequestBody";

export function completionRequest(
  body: CompletionRequestBody,
): Promise<Response> {
  return fetch(`${llamaURL.origin}/completion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stream: true, ...body }),
  });
}
