<script setup lang="ts">
import Loader from "@/frontend/src/components/Loader.vue";
</script>

<template>
  <div class="loading">
    <Loader />
  </div>
</template>

<style>
.loading {
  font-size: 4rem;
  background: var(--c-bg-0);
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
