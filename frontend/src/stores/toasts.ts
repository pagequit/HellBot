import { defineStore } from "pinia";
import { ref } from "vue";

export type Toast = {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
};

const toasts = ref<Map<number, Toast>>(new Map());

export const useToasts = defineStore("toasts", () => {
  function makeAToast(title: string, message: string, type: Toast["type"]) {
    const id = Date.now();
    toasts.value.set(id, {
      id,
      title,
      message,
      type,
    });
  }

  return { toasts, makeAToast };
});
