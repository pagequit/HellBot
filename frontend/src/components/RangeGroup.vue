<script setup lang="ts">
const model = defineModel<number>();
const { min, max, step } = defineProps<{
  label: string;
  min: number;
  max: number;
  step: number;
}>();
</script>

<template>
  <div class="range-group input-group">
    <label class="input-label">{{ label }}</label>
    <input class="input" type="number" :min="min" :max="max" v-model="model" />
    <input
      class="input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="model"
      @input="model = Number(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style>
.range-group {
  display: grid;

  .input-label {
    grid-column: 1;
    grid-row: 1;
    align-self: flex-end;
    margin-bottom: var(--sp-2);
    margin-right: var(--sp-2);
  }

  .input[type="number"] {
    grid-column: 2;
    grid-row: 1;
    width: 4.5rem;
    justify-self: end;
  }

  .input[type="range"] {
    grid-column: span 2;
    grid-row: 2;
    padding: var(--sp-2) 0 0 0;
  }
}
</style>
