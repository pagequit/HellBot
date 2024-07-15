import type { Message } from "@/features/llm/Message.ts";

export function injectFunctionCalls(
  context: Array<Message>,
  functionCalls: { [key: number]: Array<Message> },
): Array<Message> {
  for (const [index, payload] of Object.entries(functionCalls)) {
    context.splice(Number.parseInt(index) + 1, 0, ...payload);
  }

  return context;
}
