<script setup lang="ts">
import PaperPlane from "../components/icons/PaperPlane.vue";
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="input">
        <input type="text" />
        <div class="paper-plane">
          <PaperPlane />
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.input {
  display: flex;
  flex-direction: row nowrap;
  margin: var(--sp-3);
  background: var(--c-bg-1);
  border-radius: var(--sp-2);

  input {
    border-radius: var(--sp-2);
    padding: var(--sp-2);
    background: var(--c-bg-1);
    border: none;
    flex: 1 1 auto;
  }
}
.paper-plane {
  flex: 1 1 aut;
  --c-pp: var(--c-fg-3);


  cursor: pointer;
  border-radius: var(--sp-2);
  color: var(--c-pp);
  padding: var(--sp-2);
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  background: var(--c-bg-1);

  &:hover {
    background: var(--c-bg-2);
  }


  svg {
    transform: rotate(90deg);
  }
}
</style>
