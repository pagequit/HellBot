<script setup lang="ts">
import Bars from "@/frontend/src/components/icons/Bars.vue";
import Chat from "@/frontend/src/components/icons/Chat.vue";
import CodeBracket from "@/frontend/src/components/icons/CodeBracket.vue";
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

const menu = ref<HTMLElement | null>(null);
const view = ref<HTMLElement | null>(null);

function closeMenu(menu: HTMLElement) {
  menu.classList.remove("menu--open");
}

function handleMenu(event: MouseEvent) {
  const m = menu.value as HTMLElement;
  const v = view.value as HTMLElement;

  if (!m.classList.contains("menu--open")) {
    m.addEventListener(
      "click",
      () => {
        event.stopPropagation();
      },
      { once: true, passive: true }
    );
    v.addEventListener(
      "click",
      () => {
        closeMenu(m);
      },
      { once: true, passive: true }
    );
    event.stopPropagation();
  }
  m.classList.toggle("menu--open");
}
</script>

<template>
  <div class="menu" ref="menu">
    <nav class="menu-nav">
      <RouterLink class="menu-nav__item" to="/"
        ><Chat /><span>Chat</span></RouterLink
      >
      <RouterLink class="menu-nav__item" to="/commands"
        ><CodeBracket /><span>Commands</span></RouterLink
      >
    </nav>
  </div>
  <button
    ref="toggle"
    type="button"
    class="menu-toggle btn"
    @click="handleMenu"
  >
    <Bars />
  </button>

  <div ref="view" class="view">
    <RouterView />
  </div>
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

.view {
  height: 100%;
}

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
    box-shadow: 8px 0 16px 0 rgba(var(--rgb-black), 0.2);
  }
}

.menu-nav {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--sp-1);
  width: 100%;
}

.menu-nav__item {
  padding: var(--sp-2);
  border-radius: var(--sp-2);
  background: transparent;
  color: var(--c-fg-1);
  transition: all 233ms ease-in-out;
  display: flex;
  flex-flow: row nowrap;
  gap: var(--sp-2);

  &:hover,
  &.active {
    color: var(--c-fg-2);
    background: var(--c-bg-2);
  }

  svg {
    width: 1.25em;
    height: 1.25em;
  }
}

.menu-toggle {
  position: absolute;
  top: var(--sp-3);
  left: var(--sp-3);
  width: 2.5rem;
  height: 2.5rem;
  border: none;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
