<script setup lang="ts">
const model = defineModel<number>();
const { label, min, max, step } = defineProps<{
  label: string;
  min: number;
  max: number;
  step: number;
}>();

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement;
  model.value = Math.max(min, Math.min(max, Number(target.value)));
  target.value = model.value.toString();
}
</script>

<template>
  <div class="range-group">
    <label class="input-label">{{ label }}</label>
    <input
      class="input"
      type="number"
      :min="min"
      :max="max"
      :value="model"
      @change="updateValue"
    />
    <input
      class="input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="model"
      @input="updateValue"
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
