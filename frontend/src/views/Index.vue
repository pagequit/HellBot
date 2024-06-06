<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import Eye from "@/frontend/src/components/icons/Eye.vue";
import EyeOff from "@/frontend/src/components/icons/EyeOff.vue";
import Login from "@/frontend/src/components/icons/Login.vue";
import { origin } from "@/frontend/src/composables/origin.ts";
import { useI18n } from "@/frontend/src/composables/useI18n";
import de from "@/frontend/src/views/translations/de.ts";
import en from "@/frontend/src/views/translations/en.ts";
import { ref } from "vue";

type InputType = "password" | "text";

const { t } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const inputType = ref<InputType>("password");
const inputModel = defineModel<string>();

function toggleInputType(): void {
  inputType.value = inputType.value === "text" ? "password" : "text";
}

function signIn(): Promise<Response> {
  return fetch(`${origin}/auth/user`, {
    credentials: "include",
    mode: "cors",
  });
}
</script>

<template>
  <div class="index">
    <div class="input-group">
      <label for="authInput" class="input-label">{{ t("inputLabel") }}</label>
      <input
        id="authInput"
        :type="inputType"
        class="input"
        v-model="inputModel"
      />
      <button
        type="button"
        class="input-prepend-btn btn"
        @click="toggleInputType"
      >
        <Eye class="btn-icon" v-if="inputType === 'password'" />
        <EyeOff class="btn-icon" v-else />
      </button>
      <button
        @click.prevent="signIn"
        class="input-append-btn btn"
        :title="t('submitTitle')"
      >
        <Login class="btn-icon" />
      </button>
    </div>
  </div>
</template>

<style>
.index {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: var(--c-bg-0);
  display: flex;
  align-items: center;
  justify-content: center;

  .input-group {
    display: grid;
    margin-bottom: var(--sp-3);
    max-width: 24rem;
    padding: var(--sp-3);
  }

  .input-label {
    display: inline-flex;
    width: 100%;
    color: var(--c-fg-1);
    margin-left: var(--sp-2);
    margin-bottom: var(--sp-1);
    grid-row: 1;
  }

  .input {
    width: 100%;
    padding: var(--sp-2);
    grid-row: 2;
    grid-column: 1;
    padding-left: calc(2.5rem + var(--sp-2));
    padding-right: calc(2.5rem + var(--sp-2));
  }

  .btn {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: var(--sp-2);
    background: var(--c-bg-2);

    &:hover {
      background: var(--c-bg-1);
    }
  }

  .input-prepend-btn {
    grid-row: 2;
    grid-column: 1;
    justify-self: start;
  }

  .input-append-btn {
    grid-row: 2;
    grid-column: 1;
    justify-self: end;
  }

  .btn-icon {
    height: 100%;
    width: auto;
  }
}
</style>
