<script setup lang="ts">
import { ref } from "vue";

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

<style>
.popover {
  cursor: pointer;
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
