<script setup lang="ts">
import Close from "@/frontend/src/components/icons/Close.vue";
defineProps<{
  title: string;
  message: string;
}>();
</script>

<template>
  <div class="toast">
    <div class="toast-title">{{ title }}</div>
    <div class="toast-message">{{ message }}</div>
    <button type="button" class="toast-close btn" @click="">
      <Close class="toast-close-icon" />
    </button>
  </div>
</template>

<style>
.toast {
  position: relative;
  padding: var(--sp-2);
  border-radius: var(--sp-2);
  background: var(--c-bg-2);
  color: var(--c-fg-1);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}
.toast-title {
  font-weight: 600;
}
.toast-message {
}
.toast-close {
  height: 1rem;
  width: 1rem;
}

.toast-close-icon {
  height: 100%;
  width: auto;
}
</style>
