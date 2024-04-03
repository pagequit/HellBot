<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import Popover from "@/frontend/src/components/Popover.vue";
import Select from "@/frontend/src/components/Select.vue";
import Bars from "@/frontend/src/components/icons/Bars.vue";
import Chat from "@/frontend/src/components/icons/Chat.vue";
import CodeBracket from "@/frontend/src/components/icons/CodeBracket.vue";
import Language from "@/frontend/src/components/icons/Language.vue";
import Moon from "@/frontend/src/components/icons/Moon.vue";
import Sun from "@/frontend/src/components/icons/Sun.vue";
import { useOnClickOutside } from "@/frontend/src/composables/onClickOutside.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { RouterLink, RouterView } from "vue-router";

const menu = ref<HTMLElement | null>(null);
const menuOpenClass = "menu-open";

const themeLabelLight = "Light";
const themeLabelDark = "Dark";

const themes = new Map([
  [themeLabelLight, "light"],
  [themeLabelDark, "dark"],
])

const settings = useSettings();
const { setLocale, setTheme } = settings;
const { locale, theme } = storeToRefs(settings);

watch(theme, (newTheme: string, oldTheme: string) => {
  document.body.classList.remove(oldTheme);
  document.body.classList.add(newTheme);
});

document.body.classList.add(theme.value);

const languages = new Map([
  ["English", Locale.EnglishGB],
  ["Deutsch", Locale.German],
]);

onMounted(() => {
  useOnClickOutside(menu.value as HTMLElement, () =>
    (menu.value as HTMLElement).classList.remove(menuOpenClass)
  );
});
</script>

<template>
  <div class="menu" ref="menu">
    <button ref="toggle" type="button" class="menu-toggle btn" title="Menu"
      @click="menu!.classList.toggle(menuOpenClass)">
      <Bars class="toggle-icon" />
    </button>

    <nav class="menu-nav">
      <RouterLink class="nav-item chat" title="Chat" to="/">
        <Chat class="item-icon" /><span class="item-label">Chat</span>
      </RouterLink>
      <RouterLink class="nav-item commands" title="Commands" to="/commands">
        <CodeBracket class="item-icon" /><span class="item-label">Commands</span>
      </RouterLink>
    </nav>

    <div class="menu-gui">
      <div class="gui-item">
        <Language class="item-icon" />
        <Select :options="languages" class="gui-select" v-model="locale" @change="setLocale(locale)"></Select>
      </div>

      <div class="gui-item">
        <Moon class="item-icon" />
        <Select :options="themes" class="gui-select" v-model="theme" @change="setTheme(theme)"></Select>
      </div>

      <Popover class="avatar" title="User wip">
        <template #trigger>
          <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="Avatar" class="avatar-img" />
          <span class="item-label">User</span>
        </template>
        <template #target>
          <button class="nav-item btn">
            <Sun class="item-icon" /><span class="label">Logout</span>
          </button>
        </template>
      </Popover>
    </div>
  </div>

  <div class="view">
    <RouterView />
  </div>
</template>

<style>
.menu {
  position: absolute;
  background: var(--c-bg-1);
  height: 100%;
  width: 16rem;
  max-width: 100%;
  padding: calc(var(--sp-4) + 3rem) var(--sp-3) var(--sp-3);
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

.menu-gui,
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

  &:hover {
    color: var(--c-fg-1);
    background: var(--c-bg-2);
  }

  &.active {
    color: var(--c-fg-1);
    background: var(--c-bg-3);
  }
}

.item-icon {
  width: 1.25em;
  min-width: 1.25em;
  height: 1.25em;
  min-height: 1.25em;
  margin: 0 0.125rem;
}

.gui-item {
  display: flex;
  flex-flow: row nowrap;
  color: var(--c-fg-2);
  align-items: center;
  background: var(--c-bg-2);
  border-radius: var(--sp-2);
  width: 100%;
  padding-left: var(--sp-2);

  .gui-select {
    flex: 1 1 auto;
  }
}

.avatar {
  margin-top: var(--sp-3);

  bottom: var(--sp-3);
  left: var(--sp-3);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-fg-2);
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
