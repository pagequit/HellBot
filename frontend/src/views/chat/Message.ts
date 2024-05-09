import type { Ref } from "vue";

export type Message = {
  role: "user" | "assistant";
  content: string | Ref<string>;
};
