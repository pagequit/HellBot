import type { Message } from "@/features/llm/Message.ts";

export type Chat = {
  context: Array<Message>;
  contextFormatted: Array<Message>;
  functionCalls: Map<number, string>;
  title: string;
  color: string;
  isLoading: boolean;
  settings: {
    system: string; // "You are a helpful assistant."
    temperature: number; // 0.8
    stop: string; // ""
    grammar: string; // ""
    top_k: number; // 40
    top_p: number; // 0.95
    min_p: number; // 0.05
    repeat_last_n: number; // 64
    repeat_penalty: number; // 1.1
    presence_penalty: number; // 0.0 (disabled)
    frequency_penalty: number; // 0.0 (disabled)
  };
};
