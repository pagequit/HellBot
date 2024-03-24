<script setup lang="ts">
import Bars from "@/frontend/src/components/icons/Bars.vue";
import Chat from "@/frontend/src/components/icons/Chat.vue";
import CodeBracket from "@/frontend/src/components/icons/CodeBracket.vue";
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

const menu = ref<HTMLElement | null>(null);
const view = ref<HTMLElement | null>(null);
const menuOpenClass = "menu-open";

function closeMenu(menu: HTMLElement) {
  menu.classList.remove(menuOpenClass);
}

function handleMenu(event: MouseEvent) {
  const m = menu.value as HTMLElement;
  const v = view.value as HTMLElement;

  if (!m.classList.contains(menuOpenClass)) {
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
  m.classList.toggle(menuOpenClass);
}
</script>

<template>
  <div class="menu" ref="menu">
    <button ref="toggle" type="button" class="menu-toggle btn" @click="handleMenu">
      <Bars class="toggle-icon" />
    </button>

    <nav class="menu-nav">
      <RouterLink class="nav-item" to="/">
        <Chat class="item-icon" /><span class="item-label">Chat</span>
      </RouterLink>
      <RouterLink class="nav-item" to="/commands">
        <CodeBracket class="item-icon" /><span class="item-label">Commands</span>
      </RouterLink>
    </nav>

    <div class="avatar">
      <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="Avatar" class="avatar-img" />
      <span class="item-label">User</span>
    </div>
  </div>

  <div ref="view" class="view">
    <RouterView />
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  background: var(--c-bg-1);
  height: 100%;
  width: 16rem;
  max-width: 100%;
  padding: calc(var(--sp-4) + 3rem) var(--sp-3) var(--sp-3);
  overflow: hidden;
  left: -16rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  &.menu-open {
    left: 0;
    box-shadow: 8px 0 16px 0 rgba(var(--rgb-black), 0.2);
    transition: all 233ms ease-in;
  }

  @media screen and (min-width: 640px) {
    position: static;
    width: 4.5rem;

    .item-label {
      width: 0;
      overflow: hidden;
    }

    &.menu-open {
      box-shadow: none;
      width: 16rem;

      .item-label {
        width: 100%;
      }
    }
  }

  transition: all 233ms ease-out;
}

.menu-toggle {
  position: fixed;
  top: var(--sp-3);
  left: var(--sp-3);
  width: 2.5rem;
  height: 2.5rem;

  .toggle-icon {
    width: 100%;
    height: 100%;
  }
}

.menu-nav {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--sp-1);
  width: 100%;
}

.nav-item {
  padding: var(--sp-2);
  border-radius: var(--sp-2);
  background: transparent;
  color: var(--c-fg-2);
  transition: all 233ms ease-in-out;
  display: flex;
  flex-flow: row nowrap;
  gap: var(--sp-2);

  &:hover,
  &.active {
    color: var(--c-fg-1);
    background: var(--c-bg-2);
  }

}

.item-icon {
  width: 1.25em;
  min-width: 1.25em;
  height: 1.25em;
  min-height: 1.25em;
  margin: 0 0.125rem;
}

.avatar {
  bottom: var(--sp-3);
  left: var(--sp-3);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-fg-1);
}

.avatar-img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.view {
  height: 100%;
  flex: 1 1 auto;
}
</style>
