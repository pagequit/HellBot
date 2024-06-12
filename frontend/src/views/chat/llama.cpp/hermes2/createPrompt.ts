import type { Message } from "../../Message";

export function createPrompt(
  system: string,
  content: string,
  context: Array<Message>,
): string {
  return `<|im_start|>system\n${system}<|im_end|>\n${context.reduce(
    (acc, cur, idx) => {
      return idx % 2 === 0
        ? `${acc}<|im_start|>user\n${cur.content}<|im_end|>\n`
        : `${acc}<|im_start|>assistant\n${cur.content}<|im_end|>\n`;
    },
    "",
  )}<|im_start|>user\n${content}<|im_end|>\n<|im_start|>assistant\n`;
}
