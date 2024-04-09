<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  placement?: "top" | "left" | "bottom" | "right";
}>();

const targetOpenClass = "open";
const target = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="popover" @click="target!.classList.toggle(targetOpenClass)">
    <slot name="trigger"></slot>

    <div class="popover-target" ref="target">
      <slot name="target"></slot>
    </div>
  </div>
</template>

<style scoped>
.popover {
  cursor: pointer;
}

.popover-target {
  position: relative;
  right: 0;
  border-radius: var(--sp-2);
  transition: all 144ms ease-in-out;
  opacity: 0;
  visibility: hidden;

  &.open {
    opacity: 1;
    visibility: visible;
  }
}
</style>
