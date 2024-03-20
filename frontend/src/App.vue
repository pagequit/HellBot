<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DieBestie from "./components/icons/DieBestie.vue";
</script>

<template>
  <header class="header">
      <a class="home" href="/">
        <DieBestie class="logo"/>
        <span>HellNet</span>
      </a>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-3);
  background-color: var(--c-bg-1);

  .home {
    font-size: larger;
    font-weight: bold;
    color: var(--c-fg-1);
    text-decoration: none;
    flex: 0 1 auto;
    justify-content: start;
    display: flex;
    align-items: center;
    width: fit-content;
  }

  .logo {
    width: 32px;
    height: 32px;
    margin-right: var(--sp-2);
  }
}
</style>