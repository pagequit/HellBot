<script setup lang="ts">
import { I18n, Locale } from "@/core/i18n/I18n.ts";
import Popover from "@/frontend/src/components/Popover.vue";
import Adjustments from "@/frontend/src/components/icons/Adjustments.vue";
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import More from "@/frontend/src/components/icons/More.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import Pencil from "@/frontend/src/components/icons/Pencil.vue";
import Plus from "@/frontend/src/components/icons/Plus.vue";
import Trash from "@/frontend/src/components/icons/Trash.vue";
import { canUseLocalStorage } from "@/frontend/src/composables/canUseLocalStorage.ts";
import { useMarkdown } from "@/frontend/src/composables/useMarkdown.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user.ts";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import type { Chat } from "./Chat.ts";
import type { Message } from "./Message.ts";
import {
  createCompletionRequestBody,
  makePrompt,
} from "./llama.cpp/completion.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

const user = useUser();
const settings = useSettings();
const { locale } = storeToRefs(settings);
const i18n = ref(
  new I18n([
    [Locale.EnglishGB, en],
    [Locale.German, de],
  ]),
);

const markdown = useMarkdown();

const decoder = new TextDecoder();

const entries = ref<HTMLElement | null>(null);
const promptInput = ref<HTMLTextAreaElement | null>(null);

function setPromptInputHeight() {
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";
  element.style.height = `${element.scrollHeight}px`;
}

onMounted(() => {
  entries.value?.scrollTo(0, entries.value.scrollHeight);
});

const prompt = ref<string>("");

// FIXME: I need access the indices
const chat = computed(() =>
  chats.value[0].context.map((message) => message.content),
);

let localChats: Array<Chat> = [
  {
    title: "Chat 1",
    system: `I'm ${user.displayName}. You are HellBot. You are a helpful assistant.`,
    context: [],
    settings: {
      temperature: 0.8,
      top_k: 40,
      top_p: 0.95,
      min_p: 0.05,
      n_predict: -1,
      stop: [],
      repeat_penalty: 1.1,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
    },
  },
];

if (canUseLocalStorage()) {
  const lSLC = localStorage.getItem("chats");
  localChats = lSLC ? JSON.parse(lSLC) : localChats;
  localStorage.setItem("chats", JSON.stringify(localChats));
}

const chats = ref<Array<Chat>>(localChats);

async function submitPrompt() {
  const system: string = chats.value[0].system;
  const context: Array<Message> = chats.value[0].context;

  const localPrompt = prompt.value.trim();
  if (localPrompt.length === 0) {
    return;
  }

  prompt.value = "";
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";

  const response: Response | Error = await makePrompt(
    createCompletionRequestBody(system, localPrompt, context),
  ).catch((error) => {
    console.error(error);
    return error;
  });

  if (response instanceof Error) {
    return;
  }

  let userContent = localPrompt;
  try {
    userContent = markdown.parse(localPrompt);
  } catch (error) {
    console.error(error);
  }

  let rawContent = "";
  const content = ref<string>("");
  context.push({
    role: "user",
    content: userContent,
  });
  context.push({ role: "assistant", content });

  // @ts-ignore
  for await (const rawChunk of response.body) {
    const chunks = decoder.decode(rawChunk).split("\n");
    for (const chunk of chunks) {
      const message = chunk.trim();
      if (message.length > 0) {
        try {
          const data = JSON.parse(message.substring(5));
          if (data.stop) {
            console.log(data);
            /*
             * data.tokens_cached: 1246
             * data.tokens_evaluated: 704
             * data.tokens_predicted: 543
             */
          }
          rawContent += data.content;
          content.value = markdown.parse(rawContent);
        } catch (error) {
          console.error(error);
        }
        entries.value?.scrollTo(0, entries.value.scrollHeight);
      }
    }
  }

  if (canUseLocalStorage()) {
    localStorage.setItem("chats", JSON.stringify(chats.value));
  }
}

const promptPlaceholder = computed(() =>
  i18n.value.t(locale.value, "promptPlaceholder"),
);
const submitTitle = computed(() => i18n.value.t(locale.value, "submitTitle"));
</script>

<template>
  <main class="chats">
    <header class="header">
      <button class="tab-add btn">
        <Plus class="add-icon" />
      </button>
      <div class="tabs">
        <div
          v-for="(chat, index) in chats"
          class="tab btn"
          :class="{ 'tab-active': index === 0 }"
        >
          {{ chat.title }}
          <Popover class="pop-left" title="More">
            <template #trigger>
              <More class="more-icon" />
            </template>
            <template #target>
              <div class="more-options">
                <button class="more-option btn"><Pencil /></button>
                <button class="more-option btn"><Trash /></button>
              </div>
            </template>
          </Popover>
        </div>
      </div>

      <button class="settings btn">
        <Adjustments class="settings-icon" />
      </button>
    </header>
    <div class="chat">
      <DieBestie class="die-bestie" />

      <div class="entries" ref="entries">
        <div v-for="(entry, index) in chat" :key="index" class="entry">
          <img
            :src="
              index % 2 === 0
                ? user.avatarURL
                : 'https://cdn.discordapp.com/embed/avatars/0.png'
            "
            alt="Avatar"
            class="entry-avatar"
          />
          <div class="entry-content" v-html="entry"></div>
        </div>
      </div>

      <div class="prompt">
        <textarea
          class="prompt-input"
          ref="promptInput"
          v-model="prompt"
          :placeholder="promptPlaceholder"
          @input="setPromptInputHeight"
          @keydown="
            (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitPrompt();
              }
            }
          "
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
  </main>
</template>

<style>
.chats {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;

  .header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background: var(--c-bg-1);
    border-radius: var(--sp-2) 0 0 var(--sp-2);
    margin-top: var(--sp-3);
    align-self: flex-end;
    height: 2.5rem;
    margin-left: calc(var(--sp-4) + var(--sp-6));
    max-width: calc(100vw - var(--sp-4) - var(--sp-6));

    @media screen and (min-width: 640px) {
      margin-left: var(--sp-3);
    }
  }

  .tab-add {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: var(--sp-1);
  }

  .tabs {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--sp-1);
    height: 100%;
    border-radius: var(--sp-2);
    overflow-x: auto;
    flex: 0 1 auto;
  }

  .tab {
    flex: 1 0 auto;
    background: var(--c-bg-2);
    border-radius: var(--sp-2);
    padding: var(--sp-2);
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .tab:hover,
  .tab-active {
    background: var(--c-bg-3);
  }

  .more-icon {
    width: 1em;
    height: 1em;

    &:hover {
      color: var(--c-fg-1);
    }
  }

  .more-options {
    display: flex;
    flex-flow: row nowrap;
    background: var(--c-bg-1);
    border-radius: var(--sp-2);
  }

  .settings {
    margin: 0 var(--sp-3);
    width: 2.5rem;
    height: 2.5rem;
  }

  .settings-icon {
    width: 100%;
    height: 100%;
  }

  .chat {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 var(--sp-3);
    display: flex;
    flex-flow: column nowrap;
    justify-content: end;
    position: relative;
    flex: 0 1 auto;
    height: calc(100% - 2.5rem - var(--sp-3));
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

    &:nth-child(odd) {
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

  .entry-content {
    background: var(--c-bg-1);
    border-radius: var(--sp-2);
    padding: var(--sp-2) var(--sp-3);
    box-shadow: 0 2px 4px 0 rgba(var(--rgb-black), 0.1);
    line-height: 1.5;
    overflow-x: auto;
  }

  .entry-content p {
    margin-top: 0;
    margin-bottom: 0.5rem;
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
}
</style>
