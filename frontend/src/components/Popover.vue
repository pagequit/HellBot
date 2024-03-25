<script setup lang="ts">
import { ref } from "vue";

const _props = defineProps<{
  placement?: "top" | "left" | "bottom" | "right";
}>();

const menuOpenClass = "open";
const menu = ref<HTMLElement | null>(null);

function closeMenu(menu: HTMLElement) {
  menu.classList.remove(menuOpenClass);
}

function handleMenu(event: MouseEvent) {
  console.log("handleMenu");
  const m = menu.value as HTMLElement;
  // const v = view.value as HTMLElement;

  if (!m.classList.contains(menuOpenClass)) {
    m.addEventListener(
      "click",
      () => {
        event.stopPropagation();
      },
      { once: true, passive: true }
    );
    // v.addEventListener(
    //   "click",
    //   () => {
    //     closeMenu(m);
    //   },
    //   { once: true, passive: true }
    // );
    event.stopPropagation();
  }
  m.classList.toggle(menuOpenClass);
}
</script>

<template>
  <div class="popover" @click="handleMenu">
    <slot name="trigger"></slot>

    <div class="popover-target" ref="menu">
      <slot name="target"></slot>
    </div>
  </div>
</template>

<style scoped>
.popover-target {
  position: relative;
  right: 0;
  border-radius: var(--sp-2);
  box-shadow: 0 0 8px 0 rgba(var(--rgb-black), 0.2);
  transition: all 233ms ease-in-out;
  opacity: 0;
  visibility: hidden;

  &.open {
    opacity: 1;
    visibility: visible;
  }
}
</style>