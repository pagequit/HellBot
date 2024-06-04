<script setup lang="ts">
const model = defineModel<string>();
const { label } = defineProps<{
  label: string;
  type: "text" | "password";
}>();
</script>

<template>
  <div class="input-group">
    <label class="input-label">{{ label }}</label>
    <input :type="type" class="input" v-model="model" />
  </div>
</template>

<style>
.input-group {
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: var(--sp-3);

  .input-label {
    display: inline-flex;
    width: 100%;
    color: var(--c-fg-1);
    margin-left: var(--sp-2);
    margin-bottom: var(--sp-1);
  }
  .input {
    width: 100%;
    padding: var(--sp-2);
  }
}
</style>
