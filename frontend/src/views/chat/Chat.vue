<script setup lang="ts">
import { I18n, Locale } from "@/core/i18n/I18n.ts";
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

const settings = useSettings();
const { locale } = storeToRefs(settings);

const i18n = ref(
  new I18n([
    [Locale.EnglishGB, en],
    [Locale.German, de],
  ]),
);

const prompt = ref("");
const promptInput = ref<HTMLTextAreaElement | null>(null);

const promptPlaceholder = computed(() =>
  i18n.value.t(locale.value, "promptPlaceholder"),
);
const submitTitle = computed(() => i18n.value.t(locale.value, "submitTitle"));

function setPromptInputHeight() {
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";
  element.style.height = `${element.scrollHeight}px`;
}

function submitPrompt() {
  const element = promptInput.value as HTMLTextAreaElement;

  console.log(prompt.value);

  prompt.value = "";
  element.style.height = "unset";
}
</script>

<template>
  <div class="chat">
    <DieBestie class="die-bestie" />

    <div class="entries">
      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/0.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>This is just an example prompt without any real content.</p>
          <p>This is just an example prompt without any real content.</p>
        </div>
      </div>

      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/5.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>
            I'm unable to help you with that, as I'm only a language model and
            don't have the necessary information or abilities.
          </p>
        </div>
      </div>

      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/0.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>This is just an example prompt without any real content.</p>
        </div>
      </div>

      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/5.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>This is just an example prompt without any real content.</p>
        </div>
      </div>

      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/0.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>Tell me a joke.</p>
        </div>
      </div>

      <div class="entry">
        <img
          src="https://cdn.discordapp.com/embed/avatars/5.png"
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">
          <p>
            A man walks into a library and asks the librarian for books about
            paranoia.
          </p>
          <p>The librarian whispers, "They're right behind you!"</p>
          <p>
            I hope this tickles your funny bone! Let me know if you'd like to
            hear a different kind of joke.
          </p>
        </div>
      </div>
    </div>

    <div class="prompt">
      <textarea
        class="prompt-input"
        ref="promptInput"
        v-model="prompt"
        :placeholder="promptPlaceholder"
        @input="setPromptInputHeight"
      ></textarea>
      <button
        type="submit"
        class="prompt-submit btn"
        :title="submitTitle"
        @click.prevent="submitPrompt"
      >
        <PaperPlane class="submit-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat {
  width: 100%;
  height: 100%;
  max-width: 1024px;
  max-height: 100%;
  margin: 0 auto;
  padding: 0 var(--sp-3);
  display: flex;
  flex-flow: column nowrap;
  justify-content: end;
  position: relative;
}

.entries {
  display: flex;
  flex-flow: column nowrap;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
  margin-bottom: var(--sp-3);
  overflow-y: auto;
  border-radius: var(--sp-2);
}

.entry {
  display: flex;
  flex-flow: row nowrap;
  gap: var(--sp-2);

  &:nth-child(even) {
    flex-flow: row-reverse nowrap;
    padding-bottom: var(--sp-2);
  }
}

.entry-avatar {
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 100%;
  background: var(--c-bg-2);
}

.entry-text {
  background: var(--c-bg-1);
  border-radius: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  box-shadow: 0 2px 4px 0 rgba(var(--rgb-black), 0.1);
  line-height: 1.5;

  p {
    margin: 0;
  }
}

.die-bestie {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  color: var(--c-bg-1);
  padding: var(--sp-3);
  opacity: 0.666;
}

.prompt {
  line-height: 1.5;
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: var(--sp-3);
  background: var(--c-bg-1);
  border-radius: var(--sp-2);

  &:has(.prompt__input:focus) {
    outline-width: 2px;
    outline-style: solid;
    outline-color: var(--c-blurple);
  }
}

.prompt-input {
  color: var(--c-fg-1);
  border-radius: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: transparent;
  border: none;
  flex: 1 0 auto;
  resize: none;

  &:focus {
    outline: none;
  }
}

.prompt-submit {
  flex: 0 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--sp-2) var(--sp-3);
  width: fit-content;
}

.submit-icon {
  transform: rotate(90deg);
}
</style>
