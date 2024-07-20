import type { Message } from "@/features/llm/Message.ts";

export function createPrompt(
  system: string,
  content: string,
  context: Array<Message>,
): string {
  return `<|start_header_id|>system<|end_header_id|>${system}<|eot_id|>${context.reduce(
    (acc, cur, idx) => {
      return idx % 2 === 0
        ? `${acc}<|start_header_id|>user<|end_header_id|>${cur.content}<|eot_id|>`
        : `${acc}<|start_header_id|>assistant<|end_header_id|>${cur.content}<|eot_id|>`;
    },
    "",
  )}<|start_header_id|>user<|end_header_id|>${content}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;
}
