<script setup lang="ts">
import { onClickOutside } from "@/frontend/src/composables/onClickOutside.ts";
import { onMounted, onUnmounted, ref } from "vue";

const targetOpenClass = "open";

const trigger = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);

function toggle() {
  (target.value as HTMLElement).classList.toggle(targetOpenClass);
}

function close() {
  (target.value as HTMLElement).classList.remove(targetOpenClass);
}

onMounted(() => {
  const { destroy } = onClickOutside(
    [trigger.value as HTMLElement, target.value as HTMLElement],
    close,
  );

  onUnmounted(() => {
    destroy();
  });
});
</script>

<template>
  <div class="popover">
    <div ref="trigger" class="popover-trigger" @click="toggle">
      <slot name="trigger"></slot>
    </div>
    <div ref="target" class="popover-target">
      <slot name="target"></slot>
    </div>
  </div>
</template>

<style>
.popover {
  position: relative;

  &.pop-top {
    .popover-target {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      top: auto;
      right: auto;
    }
  }

  &.pop-right {
    .popover-target {
      left: calc(100% + var(--sp-2));
      top: 50%;
      transform: translateY(-50%);
      right: auto;
      bottom: auto;
    }
  }

  &.pop-left {
    .popover-target {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      left: auto;
      bottom: auto;
    }
  }

  &.pop-bottom {
    .popover-target {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      bottom: auto;
      right: auto;
    }
  }
}

.popover-trigger {
  cursor: pointer;
}

.popover-target {
  position: absolute;
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
