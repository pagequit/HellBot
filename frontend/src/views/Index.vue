<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import Popover from "@/frontend/src/components/Popover.vue";
import Select from "@/frontend/src/components/Select.vue";
import Bars from "@/frontend/src/components/icons/Bars.vue";
import Chat from "@/frontend/src/components/icons/Chat.vue";
import CodeBracket from "@/frontend/src/components/icons/CodeBracket.vue";
import Language from "@/frontend/src/components/icons/Language.vue";
import Logout from "@/frontend/src/components/icons/Logout.vue";
import Moon from "@/frontend/src/components/icons/Moon.vue";
import Sun from "@/frontend/src/components/icons/Sun.vue";
import { onClickOutside } from "@/frontend/src/composables/onClickOutside.ts";
import { origin } from "@/frontend/src/composables/origin.ts";
import { type Theme, useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { RouterLink, RouterView } from "vue-router";

const { avatarURL, displayName } = useUser();

function logout() {
  window.location.href = `${origin}/auth/logout`;
}

const menu = ref<HTMLElement | null>(null);
const menuOpenClass = "menu-open";

const themeLabelLight = "Light";
const themeLabelDark = "Dark";

const themes = new Map<string, Theme>([
  [themeLabelLight, "light"],
  [themeLabelDark, "dark"],
]);

const settings = useSettings();
const { setLocale, setTheme } = settings;
const { locale, theme } = storeToRefs(settings);

watch(theme, (newTheme: string, oldTheme: string) => {
  document.body.classList.remove(oldTheme);
  document.body.classList.add(newTheme);
});

const languages = new Map<string, Locale>([
  ["English", Locale.EnglishGB],
  ["Deutsch", Locale.German],
]);

onMounted(() => {
  onClickOutside([menu.value as HTMLElement], () =>
    (menu.value as HTMLElement).classList.remove(menuOpenClass),
  );
});
</script>

<template>
  <div class="menu" ref="menu">
    <button
      ref="toggle"
      type="button"
      class="menu-toggle btn"
      title="Menu"
      @click="menu!.classList.toggle(menuOpenClass)"
    >
      <Bars class="toggle-icon" />
    </button>

    <nav class="menu-nav">
      <RouterLink class="nav-item chat" title="Chats" to="/">
        <Chat class="item-icon" /><span class="item-label">Chats</span>
      </RouterLink>
      <RouterLink class="nav-item commands" title="Commands" to="/commands">
        <CodeBracket class="item-icon" /><span class="item-label"
          >Commands</span
        >
      </RouterLink>
    </nav>

    <div class="menu-gui">
      <div class="gui-item">
        <Select
          title="Language"
          :options="languages"
          class="gui-select"
          v-model="locale"
          @change="setLocale(locale)"
        ></Select>
        <Language class="item-icon" />
      </div>

      <div class="gui-item">
        <Select
          title="Theme"
          :options="themes"
          class="gui-select"
          v-model="theme"
          @change="setTheme(theme)"
        ></Select>
        <Moon class="item-icon" v-if="theme === 'light'" />
        <Sun class="item-icon" v-if="theme === 'dark'" />
      </div>

      <Popover class="avatar pop-right" :title="displayName">
        <template #trigger>
          <button type="button" class="avatar-btn">
            <img :src="avatarURL" alt="Avatar" class="avatar-img" />
            <span class="avatar-name">{{ displayName }}</span>
          </button>
        </template>
        <template #target>
          <button @click="logout" class="btn logout-btn">
            <Logout class="item-icon" />
            <span class="logout-label">Logout</span>
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
  z-index: 1;
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

    .nav-item .item-label,
    .avatar-name,
    .gui-select {
      opacity: 1;
      transition: opacity 233ms ease-in;
    }

    .menu-toggle {
      box-shadow: none;
    }

    .avatar-name {
      margin-left: var(--sp-2);
      margin-right: var(--sp-3);
      width: auto;
    }
  }

  @media screen and (min-width: 640px) {
    position: static;
    width: 4.5rem;

    .menu-toggle {
      box-shadow: none;
    }

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
  box-shadow: 0 0 0 2px var(--c-bg-0);

  .toggle-icon {
    width: 100%;
    height: 100%;
  }
}

.menu-gui,
.menu-nav {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--sp-2);
  width: 100%;
}

.nav-item {
  padding: var(--sp-2);
  border-radius: var(--sp-2);
  background: var(--c-bg-2);
  color: var(--c-fg-2);
  transition: all 89ms ease-in-out;
  display: flex;
  flex-flow: row nowrap;
  gap: var(--sp-2);

  &:hover {
    color: var(--c-fg-1);
    background: var(--c-bg-3);
  }

  &.active {
    color: var(--c-fg-1);
    background: var(--c-bg-3);
  }

  .item-label {
    opacity: 0;
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
  color: var(--c-fg-2);
  background: var(--c-bg-2);
  border-radius: var(--sp-2);
  display: grid;
  align-items: center;
  transition: all 89ms ease-in-out;

  &:has(.select:focus) {
    outline-width: 2px;
    outline-style: solid;
    outline-color: var(--c-blurple);
  }

  &:hover {
    color: var(--c-fg-1);
    background: var(--c-bg-3);
  }

  &:active {
    color: var(--c-fg-1);
    background: var(--c-bg-3);
  }

  .item-icon {
    grid-column: 1;
    grid-row: 1;
    pointer-events: none;
    margin-left: calc(1.625rem - var(--sp-3));
  }

  .gui-select {
    grid-column: 1;
    grid-row: 1;
    opacity: 0;

    .select {
      background: transparent;
      padding-left: calc(1.5rem + var(--sp-3));
    }
  }
}

.avatar {
  margin-top: var(--sp-3);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-fg-2);
  width: fit-content;

  .popover-target {
    height: 100%;
  }
}

.avatar-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: var(--c-fg-2);
  border-radius: var(--sp-4);
  padding: 0;
  overflow: hidden;
}

.avatar-name {
  opacity: 0;
  width: 0;
}

.avatar-img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.logout-btn.btn {
  padding: var(--sp-2) var(--sp-3);
  display: flex;
  flex-flow: row nowrap;
  gap: var(--sp-1);
  color: var(--c-white);
  background: rgba(var(--rgb-red), 1);
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: var(--sp-4);

  &:active,
  &:hover {
    color: var(--c-white);
    background: rgba(var(--rgb-red), 0.95);
  }
}

.logout-label {
  margin-right: var(--sp-2);
}

.view {
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  transition: width 233ms ease-out;

  @media screen and (min-width: 640px) {
    width: calc(100% - 4.5rem);
  }
}

.menu-open + .view {
  transition: width 233ms ease-in;
  @media screen and (min-width: 640px) {
    width: calc(100% - 16rem);
  }
}
</style>
