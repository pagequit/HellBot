export type Message = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
};
