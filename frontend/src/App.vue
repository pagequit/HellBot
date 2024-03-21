<script setup lang="ts">
import Bars from "@/frontend/src/components/icons/Bars.vue";
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

const menu = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="menu" ref="menu">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </div>
  <button
    type="button"
    class="menu-toggle"
    @click="menu!.classList.toggle('menu--open')"
  >
    <Bars />
  </button>

  <RouterView />
</template>

<style>
.menu {
  position: absolute;
  background: var(--c-bg-1);
  height: 100%;
  padding-top: calc(var(--sp-4) + 3rem);
  padding-right: 0;
  padding-bottom: var(--sp-3);
  padding-left: 0;
  width: 0;
  max-width: 100%;
  overflow: hidden;
  transition: all 233ms ease-out;

  &.menu--open {
    width: 16rem;
    transition: all 233ms ease-in;
    padding-right: var(--sp-3);
    padding-left: var(--sp-3);
  }
}

.menu-toggle {
  position: absolute;
  cursor: pointer;
  top: var(--sp-3);
  left: var(--sp-3);
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: var(--sp-2);
  color: var(--c-fg-2);
  padding: var(--sp-2);
  background: var(--c-bg-1);

  &:hover {
    background: var(--c-bg-2);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
