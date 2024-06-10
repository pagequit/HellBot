import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export type Toast = {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
};

export const useToasts = defineStore("toasts", () => {
  const toasts = ref<Array<Toast>>([]);

  function makeAToast(title: string, message: string, type: Toast["type"]) {
    toasts.value.push({
      title,
      message,
      type,
    });

    // setTimeout(() => {
    //   toasts.value.pop();
    // }, 2584);
  }

  return { toasts, makeAToast };
});
