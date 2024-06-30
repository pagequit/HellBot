import type { Message } from "../../Message.ts";

export function createPrompt(
  system: string,
  message: Message,
  context: Array<Message>,
): string {
  return `<|im_start|>system\n${system}<|im_end|>\n${context.reduce(
    (acc, cur) => `${acc}<|im_start|>${cur.role}\n${cur.content}<|im_end|>\n`,
    "",
  )}<|im_start|>${message.role}\n${message.content}<|im_end|>\n<|im_start|>assistant\n`;
}
