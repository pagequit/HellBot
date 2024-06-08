<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import InputGroup from "@/frontend/src/components/InputGroup.vue";
import RangeGroup from "@/frontend/src/components/RangeGroup.vue";
import TextareaGroup from "@/frontend/src/components/TextareaGroup.vue";
import Adjustments from "@/frontend/src/components/icons/Adjustments.vue";
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import Plus from "@/frontend/src/components/icons/Plus.vue";
import Trash from "@/frontend/src/components/icons/Trash.vue";
import { canUseLocalStorage } from "@/frontend/src/composables/canUseLocalStorage.ts";
import { useI18n } from "@/frontend/src/composables/useI18n.ts";
import { useIdenticon } from "@/frontend/src/composables/useIdenticon.ts";
import { useMarkdown } from "@/frontend/src/composables/useMarkdown.ts";
import { useUser } from "@/frontend/src/stores/user.ts";
import { computed, onMounted, reactive, ref } from "vue";
import type { Chat } from "./Chat.ts";
import type { Message } from "./Message.ts";
import { makePrompt } from "./llama.cpp/completion.ts";
import { createPrompt } from "./llama.cpp/llama3/createPrompt.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

type ChatComponent = {
  color: string;
} & Chat;

const user = useUser();

const { t } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const decoder = new TextDecoder();
const markdown = useMarkdown();

const entries = ref<HTMLElement | null>(null);
const promptInput = ref<HTMLTextAreaElement | null>(null);

function setPromptInputHeight(): void {
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";
  element.style.height = `${element.scrollHeight}px`;
}

onMounted(() => {
  entries.value?.scrollTo(0, entries.value.scrollHeight);
});

const prompt = ref<string>("");
const activeChatIndex = ref<number>(0);
const activeChat = computed<ChatComponent>(() => chats[activeChatIndex.value]);

function* createColorClassGenerator(): Generator<string, void, unknown> {
  let i = 0;
  while (true) {
    yield ["c-blurple", "c-fuchsia", "c-green", "c-red", "c-yellow", "c-gray"][
      i
    ];
    i = (i + 1) % 6;
  }
}

const cCGen = createColorClassGenerator();

function createChat(title: string): ChatComponent {
  const color = cCGen.next().value as string;

  return structuredClone({
    context: [],
    title,
    color,
    settings: {
      system: `I'm ${user.displayName}. You are HellBot. You are a helpful assistant.`,
      stop: "",
      temperature: 0.8,
      top_k: 40,
      top_p: 0.95,
      min_p: 0.05,
      repeat_penalty: 1.1,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
    },
  });
}

let localChats: Array<ChatComponent> = [createChat("Chat")];

if (canUseLocalStorage()) {
  const lSLC = localStorage.getItem("chats");
  localChats = lSLC ? JSON.parse(lSLC) : localChats;
  localStorage.setItem("chats", JSON.stringify(localChats));
}

const chats: Array<ChatComponent> = reactive<Array<ChatComponent>>(localChats);

async function submitPrompt(): Promise<void> {
  const system: string = activeChat.value.settings.system;
  const context: Array<Message> = activeChat.value.context;

  const localPrompt = prompt.value.trim();
  if (localPrompt.length === 0) {
    return;
  }

  prompt.value = "";
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";

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
  content.value = "...";

  const response: Response | Error = await makePrompt({
    prompt: createPrompt(system, localPrompt, context),
    stop:
      activeChat.value.settings.stop.trim().length > 0
        ? activeChat.value.settings.stop.trim().split(/\s/)
        : [],
    temperature: activeChat.value.settings.temperature,
    top_k: activeChat.value.settings.top_k,
    top_p: activeChat.value.settings.top_p,
    min_p: activeChat.value.settings.min_p,
    repeat_penalty: activeChat.value.settings.repeat_penalty,
    presence_penalty: activeChat.value.settings.presence_penalty,
    frequency_penalty: activeChat.value.settings.frequency_penalty,
  }).catch((error) => {
    console.error(error);
    return error;
  });

  if (response instanceof Error) {
    return;
  }

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

  saveChats();
}

function saveChats(): void {
  if (canUseLocalStorage()) {
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

function reduceChatSettings(chat: ChatComponent): string {
  return Object.values(chat.settings).reduce<string>(
    (acc, cur) => `${acc}${cur}`,
    "",
  );
}

function addChat(): void {
  chats.unshift(createChat(`Chat ${chats.length + 1}`));
  saveChats();
}

function deleteChat(index: number): void {
  activeChatIndex.value = index === chats.length - 1 ? index - 1 : index;
  chats.splice(index, 1);
  saveChats();
}

const { generate } = useIdenticon();

const identicon = computed(() =>
  generate(reduceChatSettings(activeChat.value)),
);

const settingsMenu = ref<HTMLElement | null>(null);

const promptPlaceholder = computed(() => t("promptPlaceholder"));
const submitTitle = computed(() => t("submitTitle"));
</script>

<template>
  <main class="chats">
    <header class="header">
      <button class="tab-add btn" @click="addChat">
        <Plus class="add-icon" />
      </button>
      <div class="tabs">
        <button
          v-for="(chat, index) in chats"
          class="tab btn"
          :class="{ 'tab-active': index === activeChatIndex }"
          @click="activeChatIndex = index"
        >
          <div
            class="tab-avatar"
            :class="chat.color"
            v-html="generate(reduceChatSettings(chat))"
          ></div>
          <span class="tab-title">{{ chat.title }}</span>
        </button>
      </div>

      <button
        class="settings-btn btn"
        @click="settingsMenu!.classList.toggle('open')"
      >
        <Adjustments class="settings-icon" />
      </button>
    </header>

    <div class="chat">
      <DieBestie class="die-bestie" />

      <div class="entries" ref="entries">
        <div
          v-for="({ content }, index) in activeChat.context"
          :key="index"
          class="entry"
        >
          <img
            v-if="index % 2 === 0"
            :src="user.avatarURL"
            alt="Avatar"
            class="entry-avatar"
          />
          <div
            v-else
            class="entry-avatar"
            :class="activeChat.color"
            v-html="identicon"
          ></div>

          <div class="entry-content" v-html="content"></div>
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
            (event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
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

    <div ref="settingsMenu" class="settings-menu">
      <div class="settings-item">
        <InputGroup :label="'Title'" type="text" v-model="activeChat.title" />

        <TextareaGroup :label="'System'" v-model="activeChat.settings.system" />

        <InputGroup
          :label="'Stop'"
          type="text"
          v-model="activeChat.settings.stop"
        />

        <RangeGroup
          :label="'Temperature'"
          :min="0"
          :max="2.0"
          :step="0.1"
          v-model="activeChat.settings.temperature"
        />

        <RangeGroup
          :label="'Top K'"
          :min="1"
          :max="100"
          :step="1"
          v-model="activeChat.settings.top_k"
        />

        <RangeGroup
          :label="'Top P'"
          :min="0.05"
          :max="1"
          :step="0.05"
          v-model="activeChat.settings.top_p"
        />

        <RangeGroup
          :label="'Min P'"
          :min="0"
          :max="1"
          :step="0.05"
          v-model="activeChat.settings.min_p"
        />

        <RangeGroup
          :label="'Repeat Penalty'"
          :min="0.1"
          :max="2"
          :step="0.05"
          v-model="activeChat.settings.repeat_penalty"
        />

        <RangeGroup
          :label="'Presence Penalty'"
          :min="0"
          :max="1"
          :step="0.05"
          v-model="activeChat.settings.presence_penalty"
        />

        <RangeGroup
          :label="'Frequency Penalty'"
          :min="0"
          :max="1"
          :step="0.05"
          v-model="activeChat.settings.presence_penalty"
        />

        <hr class="divider" />

        <button
          :disabled="chats.length === 1"
          class="delete-btn btn"
          @click="deleteChat(activeChatIndex)"
        >
          <Trash class="delete-icon" />
          <span class="delete-label">Delete</span>
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
    height: calc(100% + var(--sp-2));
    border-radius: var(--sp-2);
    overflow-x: auto;
    flex: 0 1 auto;
    padding: var(--sp-1);
    margin-top: calc(var(--sp-1) * -1);
    margin-bottom: calc(var(--sp-1) * -1);
  }

  .tab {
    flex: 1 0 auto;
    background: var(--c-bg-2);
    border-radius: var(--sp-2);
    padding: var(--sp-2);
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    min-width: var(--sp-6);
  }

  .tab-avatar > svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .tab:hover,
  .tab-active {
    background: var(--c-bg-3);
  }

  .tab-title {
    background: transparent;
    color: var(--c-fg-2);
    margin: 0 2px 2px 0;
  }

  .more-icon {
    width: 1rem;
    height: 1rem;
    display: block;

    &:hover {
      color: var(--c-fg-1);
    }
  }

  .more-options {
    height: 2rem;
    display: flex;
    flex-flow: row nowrap;
    background: var(--c-bg-1);
    border-radius: var(--sp-2);

    .btn {
      width: 2rem;
    }

    svg {
      height: 100%;
      width: auto;
    }
  }

  .delete-btn {
    color: var(--c-white);
    background: var(--c-red);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: var(--sp-3);

    &[disabled] {
      pointer-events: none;
    }

    .delete-label {
      margin-right: var(--sp-1);
    }

    .delete-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .settings-btn {
    margin: 0 var(--sp-3);
    width: 2.5rem;
    height: 2.5rem;
  }

  .settings-icon {
    height: 100%;
    width: auto;
  }

  .settings-menu {
    position: absolute;
    right: 0;
    top: calc(2.5rem + var(--sp-5));
    height: calc(100% - 2.5rem - var(--sp-5));
    background: var(--c-bg-1);
    border-radius: var(--sp-2) 0 0 var(--sp-2);
    width: 0;
    transition: width 144ms ease-out;
    overflow: hidden;

    &.open {
      width: 16rem;
      box-shadow: 8px 0 16px 0 rgba(var(--rgb-black), 0.2);
      transition: width 144ms ease-in;
      overflow-y: auto;
    }

    .textarea-group,
    .range-group,
    .input-group {
      margin: var(--sp-3);
    }

    .divider {
      margin: var(--sp-3);
      border-color: var(--c-fg-3);
      border-bottom: none;
    }
  }

  .chat {
    height: calc(100% - 2.5rem - var(--sp-5));
    width: 100%;
    max-width: 1024px;
    margin: var(--sp-3) auto 0;
    padding: 0 var(--sp-3);
    display: flex;
    flex-flow: column nowrap;
    justify-content: end;
    position: relative;
    flex: 0 1 auto;
  }

  .entries {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--sp-2);
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
    }

    &:nth-child(even) {
      padding-bottom: var(--sp-2);
    }
  }

  .entry-avatar > svg,
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
    margin-bottom: var(--sp-2);
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

    &:has(.prompt-input:focus) {
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
