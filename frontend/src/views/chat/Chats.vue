<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import type { FunctionCallEventData } from "@/features/llm/parseStreamToCompletionResult.ts";
import InputGroup from "@/frontend/src/components/InputGroup.vue";
import Loader from "@/frontend/src/components/Loader.vue";
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
import { useToasts } from "@/frontend/src/stores/toasts.ts";
import { useUser } from "@/frontend/src/stores/user.ts";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import type { Chat } from "./Chat.ts";
import MessageEntry from "./MessageEntry.vue";
import { injectFunctionCalls } from "./injectFunctionCalls.ts";
import { makeCompletionRequest } from "./llama.cpp/completion.ts";
import { createPrompt } from "./llama.cpp/hermes2/createPrompt.ts";
// import { createPrompt } from "./llama.cpp/llama3/createPrompt.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";

const { t } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

const { makeAToast } = useToasts();

const user = useUser();

const { generate } = useIdenticon();

const markdown = useMarkdown();

const colorClassGenerator = (function* createColorClassGenerator(): Generator<
  string,
  void,
  unknown
> {
  let i = 0;
  const colorClasses = [
    "c-blurple",
    "c-fuchsia",
    "c-green",
    "c-red",
    "c-yellow",
    "c-gray",
  ];
  while (true) {
    yield colorClasses[i];
    i = (i + 1) % colorClasses.length;
  }
})();

const settingsMenu = ref<HTMLElement | null>(null);
const entries = ref<HTMLElement | null>(null);
const promptInput = ref<HTMLTextAreaElement | null>(null);

const promptPlaceholder = computed(() => t("promptPlaceholder"));
const submitTitle = computed(() => t("submitTitle"));
const identicon = computed(() =>
  generate(reduceChatSettings(activeChat.value)),
);

let localChats: Array<Chat> = [createChat("Chat")];
if (canUseLocalStorage()) {
  const fromLocalStorage = localStorage.getItem("chats");
  try {
    localChats = fromLocalStorage ? JSON.parse(fromLocalStorage) : localChats;
    localStorage.setItem("chats", JSON.stringify(localChats));
  } catch (error) {
    console.error(error);
    makeAToast((error as Error).message, "error");
  }
}

const chats: Array<Chat> = reactive<Array<Chat>>(localChats);
const prompt = ref<string>("");
const activeChatIndex = ref<number>(0);
const activeChat = computed<Chat>(() => chats[activeChatIndex.value]);

function createChat(title: string): Chat {
  return structuredClone({
    isLoading: false,
    color: colorClassGenerator.next().value as string,
    context: [],
    contextFormatted: [],
    functionCalls: {},
    title,
    settings: {
      system: `I'm ${user.displayName}. You are HellBot. You are a helpful assistant.`,
      stop: "",
      grammar: "",
      temperature: 0.8,
      top_k: 40,
      top_p: 0.95,
      min_p: 0.05,
      repeat_last_n: 64,
      repeat_penalty: 1.1,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
    },
  });
}

async function submitPrompt(): Promise<void> {
  const system = activeChat.value.settings.system;
  const context = activeChat.value.context;
  const contextFormatted = activeChat.value.contextFormatted;

  const rawPrompt = prompt.value.trim();
  if (rawPrompt.length === 0) {
    return;
  }

  prompt.value = "";
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";

  const localPrompt = createPrompt(
    system,
    rawPrompt,
    injectFunctionCalls(context, activeChat.value.functionCalls),
  );

  context.push({
    role: "user",
    content: rawPrompt,
  });
  contextFormatted.push({
    role: "user",
    content: markdown.parse(rawPrompt),
  });

  context.push({
    role: "assistant",
    content: "",
  });
  contextFormatted.push({
    role: "assistant",
    content: "",
  });

  nextTick(() => {
    entries.value?.scrollTo(0, entries.value.scrollHeight);
  });

  const controller = new AbortController();
  activeChat.value.isLoading = true;

  const response: Response | Error = await makeCompletionRequest(
    {
      prompt: localPrompt,
      stop:
        activeChat.value.settings.stop.trim().length > 0
          ? activeChat.value.settings.stop.trim().split(/\s/)
          : [],
      grammar: activeChat.value.settings.grammar,
      temperature: activeChat.value.settings.temperature,
      top_k: activeChat.value.settings.top_k,
      top_p: activeChat.value.settings.top_p,
      min_p: activeChat.value.settings.min_p,
      repeat_last_n: activeChat.value.settings.repeat_last_n,
      repeat_penalty: activeChat.value.settings.repeat_penalty,
      presence_penalty: activeChat.value.settings.presence_penalty,
      frequency_penalty: activeChat.value.settings.frequency_penalty,
    },
    controller,
  ).catch((error) => {
    console.error(error);
    return error;
  });

  if (response instanceof Error) {
    makeAToast(response.message, "error");
    activeChat.value.isLoading = false;
    return;
  }

  const eventSource = new EventTarget();

  eventSource.addEventListener("message", (event) => {
    const message = (event as MessageEvent).data;

    try {
      const data = JSON.parse(message.trim());
      content += data.content;
    } catch (error) {
      console.error(error);
      makeAToast((error as Error).message, "error");
    }

    contextFormatted[contextFormatted.length - 1].content =
      markdown.parse(content);
    entries.value?.scrollTo(0, entries.value.scrollHeight);
  });

  eventSource.addEventListener("functionCall", (event) => {
    const message = (event as CustomEvent).detail;

    try {
      const data: FunctionCallEventData = JSON.parse(message.trim());
      console.log(data.response);
      activeChat.value.functionCalls[activeChat.value.context.length] =
        data.response;

      makeAToast(`Function call "${data.functionCall}" executed.`, "info");
    } catch (error) {
      console.error(error);
      makeAToast((error as Error).message, "error");
    }
  });

  const decoder = new TextDecoder();
  let content = "";
  let leftover = "";
  // @ts-ignore
  for await (const value of response.body) {
    const text = leftover + decoder.decode(value);
    console.log(text);
    const lines = text.split("\n");
    leftover = text.endsWith("\n") ? "" : (lines.pop() as string);
    const fields = new Map<string, string>();

    for (const line of lines) {
      const match = line.match(/(\w+):(.*)/);
      if (!match) {
        continue;
      }

      fields.set(match[1], match[2]);
    }

    if (fields.has("event")) {
      eventSource.dispatchEvent(
        new CustomEvent((fields.get("event") as string).trim(), {
          detail: fields.get("data"),
        }),
      );
    } else {
      eventSource.dispatchEvent(
        new MessageEvent("message", { data: fields.get("data") }),
      );
    }
  }

  context[context.length - 1].content = content;
  activeChat.value.isLoading = false;
  saveChats();
}

function saveChats(): void {
  if (canUseLocalStorage()) {
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

function reduceChatSettings(chat: Chat): string {
  return Object.values(chat.settings).reduce<string>(
    (acc, cur) => `${acc}${cur}`,
    "",
  );
}

function addChat(): void {
  chats.unshift(createChat(`Chat ${chats.length + 1}`));
  activeChatIndex.value = 0;
  saveChats();
}

function deleteChat(index: number): void {
  activeChatIndex.value = index === chats.length - 1 ? index - 1 : index;
  chats.splice(index, 1);
  saveChats();
}

function setPromptInputHeight(): void {
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";
  element.style.height = `${element.scrollHeight}px`;
}

onMounted(() => {
  entries.value?.scrollTo(0, entries.value.scrollHeight);
});
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
          v-for="({ content }, index) in activeChat.contextFormatted"
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

          <div class="entry-content">
            <MessageEntry>
              <template v-slot:md>
                <div class="entry-md" v-html="content"></div>
              </template>
              <template v-slot:plain>
                <code class="entry-text">{{
                  activeChat.context[index].content
                }}</code>
              </template>
            </MessageEntry>
            <Loader
              v-if="
                activeChat.isLoading && index === activeChat.context.length - 1
              "
            />
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
      <InputGroup :label="'Title'" type="text" v-model="activeChat.title" />

      <TextareaGroup :label="'System'" v-model="activeChat.settings.system" />

      <InputGroup
        :label="'Stop'"
        type="text"
        v-model="activeChat.settings.stop"
      />

      <TextareaGroup :label="'Grammar'" v-model="activeChat.settings.grammar" />

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
        :label="'Penalty last N'"
        :min="0"
        :max="128"
        :step="1"
        v-model="activeChat.settings.repeat_last_n"
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
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
  }

  .entry-md {
    margin-bottom: var(--sp-1);
  }

  pre code,
  .entry-text {
    display: block;
    background: var(--c-bg-0);
    padding: var(--sp-1) var(--sp-2);
    border-radius: var(--sp-1);
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
