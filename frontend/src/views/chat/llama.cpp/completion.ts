import { origin } from "@/frontend/src/composables/origin.ts";
import type { Message } from "../Message.ts";
import { createPrompt } from "./llama3/createPrompt.ts";

export type CompletionRequestBody = {
  stream: boolean;
  stop: string[];
  n_predict: number;
  temperature: number;
  prompt: string;
};

export function createCompletionRequestBody(
  system: string,
  content: string,
  context: Array<Message>,
): CompletionRequestBody {
  return {
    stream: true,
    stop: [],
    n_predict: 1024,
    temperature: 0.8,
    prompt: createPrompt(system, content, context),
  };
}

export function makePrompt(body: CompletionRequestBody): Promise<Response> {
  return fetch(`${origin}/completion`, {
    credentials: "include",
    mode: "cors",
    method: "POST",
    body: JSON.stringify(body),
  });
}
