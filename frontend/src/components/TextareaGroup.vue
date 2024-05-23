<script setup lang="ts">
const model = defineModel<string>();
const { label } = defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="textarea-group">
    <label class="input-label">{{ label }}</label>
    <textarea ref="input" class="input" v-model="model"></textarea>
  </div>
</template>

<style>
.textarea-group {
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
    min-width: 100%;
    min-width: 100%;
    padding: var(--sp-2);
  }
}
</style>
