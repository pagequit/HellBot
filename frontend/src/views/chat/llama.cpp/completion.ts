import { origin } from "@/frontend/src/composables/origin.ts";
import type { Message } from "../Message.ts";
import { createPrompt } from "./llama3/createPrompt.ts";

export type CompletionRequestBody = {
  prompt: string;
  stream: boolean;
  stop: string;
  n_predict: number;
  temperature: number;
  top_k: number;
  top_p: number;
  min_p: number;
  repeat_penalty: number;
  presence_penalty: number;
  frequency_penalty: number;
};

export function createCompletionRequestBody(
  system: string,
  content: string,
  context: Array<Message>,
): CompletionRequestBody {
  return {
    prompt: createPrompt(system, content, context),
    stream: true,
    stop: "",
    n_predict: 1025,
    temperature: 0.8,
    top_k: 40,
    top_p: 0.95,
    min_p: 0.05,
    repeat_penalty: 1.1,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
  };
}

export function makePrompt(body: CompletionRequestBody): Promise<Response> {
  return fetch(`${origin}/completion`, {
    credentials: "include",
    mode: "cors",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
