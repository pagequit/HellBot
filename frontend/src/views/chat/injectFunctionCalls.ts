import type { Message } from "@/features/llm/Message.ts";

export function injectFunctionCalls(
  context: Array<Message>,
  functionCalls: { [key: number]: Array<Message> },
): Array<Message> {
  const contextCopy = [...context];
  for (const [index, payload] of Object.entries(functionCalls)) {
    contextCopy.splice(Number.parseInt(index), 0, ...payload);
  }

  return contextCopy;
}
