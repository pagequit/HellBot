import type { Message } from "./Message.ts";

export type Chat = {
  title: string;
  system: string;
  context: Array<Message>;
  settings: {
    temperature: number;
    top_k: number; // 40
    top_p: number; // 0.95
    min_p: number; // 0.05
    n_predict: number; // -1
    stop: string[];
    repeat_penalty: number; // 1.1
    presence_penalty: number; // 0.0 (disabled)
    frequency_penalty: number; // 0.0 (disabled)
  };
};
