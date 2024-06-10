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
    <button type="button" class="toast-close" @click="">
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
  border-left: 2px solid var(--c-blurple);
  display: grid;
  grid-gap: var(--sp-2);
  box-shadow: 8px 0 16px 0 rgba(var(--rgb-black), 0.2);

  margin-top: var(--sp-3);
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
}

.toast-close-icon {
  height: 100%;
  width: auto;
}
</style>
