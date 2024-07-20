<script setup lang="ts">
import Close from "@/frontend/src/components/icons/Close.vue";
import type { Toast } from "@/frontend/src/stores/toasts";
import { useToasts } from "@/frontend/src/stores/toasts";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { id, message, type } = defineProps<Toast>();

const t = useToasts();
const { toasts } = storeToRefs(t);
const ttl = 6765;
const titleMap: Record<Toast["type"], string> = {
  info: "Info",
  warning: "Warning",
  success: "Success",
  error: "Error",
};

function deleteSelf() {
  toasts.value.delete(id);
}

onMounted(() => {
  setTimeout(deleteSelf, ttl);
});
</script>

<template>
  <div class="toast" :class="type">
    <div class="toast-title">{{ titleMap[type] }}</div>
    <div class="toast-message">{{ message }}</div>
    <button type="button" class="toast-close" @click="deleteSelf">
      <Close class="toast-close-icon" />
    </button>
  </div>
</template>

<style>
.toast {
  position: relative;
  padding: var(--sp-2) var(--sp-2) var(--sp-3) var(--sp-3);
  border-radius: var(--sp-2);
  background: var(--c-bg-2);
  color: var(--c-fg-1);
  border-left: var(--sp-1) solid;
  display: grid;
  grid-gap: var(--sp-2);
  box-shadow: 8px 0 16px 0 rgba(var(--rgb-black), 0.2);
  width: 16rem;
  max-width: calc(100vw - var(--sp-3));
  box-sizing: border-box;

  margin-top: var(--sp-3);

  &.info {
    border-color: var(--c-blurple);
  }

  &.warning {
    border-color: var(--c-yellow);
  }

  &.success {
    border-color: var(--c-green);
  }

  &.error {
    border-color: var(--c-red);
  }
}
.toast-title {
  font-weight: 600;
  grid-row: 1;
}
.toast-message {
  grid-row: 2;
}
.toast-close {
  grid-row: 1;
  height: 1rem;
  width: 1rem;
  border-radius: 2px;
  background: transparent;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  justify-self: end;
}

.toast-close-icon {
  height: 100%;
  width: auto;
}
</style>
