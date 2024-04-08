<script setup lang="ts">
const selected = defineModel();
const props = defineProps<{
  options: Map<string, string>;
}>();
</script>

<template>
  <div class="select-wrapper">
    <select v-model="selected" class="select">
      <option v-for="[key, value] in options" :value="value" class="option">
        {{ key }}
      </option>
    </select>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="select-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  </div>
</template>

<style>
.select-wrapper {
  position: relative;
}

.select {
  width: 100%;
  appearance: none;
  cursor: pointer;
  border-radius: var(--sp-2);
  color: var(--c-fg-2);
  padding: var(--sp-1) var(--sp-2);
  background: var(--c-bg-2);
  border: none;
  line-height: 1.75;

  &:hover {
    background: var(--c-bg-3);
  }

  &:active {
    color: var(--c-fg-1);
  }
}

.select-icon {
  color: var(--c-fg-2);
  position: absolute;
  height: 1.125em;
  width: 1.125em;
  right: var(--sp-1);
  top: 50%;
  transform: translate(0, -50%);
  pointer-events: none;
}
</style>
