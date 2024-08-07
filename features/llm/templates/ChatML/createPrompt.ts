import type { Message } from "@/features/llm/Message.ts";

export function createPrompt(
  system: string,
  content: string,
  context: Array<Message>,
): string {
  return `<|im_start|>system\n${system}<|im_end|>\n${context.reduce(
    (acc, cur) => `${acc}<|im_start|>${cur.role}\n${cur.content}<|im_end|>\n`,
    "",
  )}<|im_start|>user\n${content}<|im_end|>\n<|im_start|>assistant\n`;
}
