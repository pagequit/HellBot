<script setup lang="ts">
import Bug from "@/frontend/src/components/icons/Bug.vue";
import BugOff from "@/frontend/src/components/icons/BugOff.vue";
import { ref } from "vue";

const debug = ref(false);
</script>

<template>
  <div class="message-entry">
    <button class="bug-btn btn" @click="debug = !debug">
      <Bug v-if="!debug" class="bug-icon" />
      <BugOff v-else class="bug-icon" />
    </button>
    <slot name="md"></slot>
    <slot v-if="debug" name="plain"></slot>
  </div>
</template>

<style>
.message-entry {
  position: relative;

  &:hover .bug-btn {
    opacity: 1;
  }

  .bug-btn {
    position: absolute;
    top: calc(-1 * var(--sp-1));
    right: calc(-1 * var(--sp-2));
    height: 1.5rem;
    width: 1.5rem;
    padding: var(--sp-1);
    opacity: 0;
    transition: opacity 89ms ease-in;

    &:focus {
      opacity: 1;
    }
  }
}
</style>
