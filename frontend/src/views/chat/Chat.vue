<script setup lang="ts">
import { I18n, Locale } from "@/core/i18n/I18n.ts";
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import { origin } from "@/frontend/src/composables/origin.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user.ts";
import { storeToRefs } from "pinia";
import { type Ref, computed, onMounted, ref } from "vue";
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

type CompletionRequestBody = {
  stream: boolean;
  stop: string[];
  n_predict: number;
  temperature: number;
  prompt: string;
};

type Message = {
  role: "user" | "assistant";
  content: string | Ref<string>;
};

function createPrompt(
  system: string,
  content: string,
  context: Array<Message>,
): string {
  return `<|start_header_id|>system<|end_header_id|>${system}<|eot_id|>${context.reduce(
    (acc, cur, idx) => {
      return idx % 2 === 0
        ? `${acc}<|start_header_id|>user<|end_header_id|>${cur.content}<|eot_id|>`
        : `${acc}<|start_header_id|>assistant<|end_header_id|>${cur.content}<|eot_id|>`;
    },
    "",
  )}<|start_header_id|>user<|end_header_id|>${content}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;
}

function createCompletionRequestBody(
  system: string,
  content: string,
  context: Array<Message>,
): CompletionRequestBody {
  return {
    stream: true,
    stop: [],
    n_predict: 1024,
    temperature: 0.8,
    prompt: createPrompt(system, content, context),
  };
}

function makePrompt(body: CompletionRequestBody): Promise<Response> {
  return fetch(`${origin}/completion`, {
    credentials: "include",
    mode: "cors",
    method: "POST",
    body: JSON.stringify(body),
  });
}

function setPromptInputHeight() {
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";
  element.style.height = `${element.scrollHeight}px`;
}

const decoder = new TextDecoder();
const system: Ref<string> = ref("You are a helpful assistant");
const context: Ref<Array<Message>> = ref([]);
const prompt: Ref<string> = ref("");
const promptInput = ref<HTMLTextAreaElement | null>(null);

async function submitPrompt() {
  const localPrompt = prompt.value.trim();
  if (localPrompt.length === 0) {
    return;
  }
  prompt.value = "";
  const element = promptInput.value as HTMLTextAreaElement;
  element.style.height = "unset";

  const response: Response | Error = await makePrompt(
    createCompletionRequestBody(system.value, localPrompt, context.value),
  ).catch((error) => {
    console.error(error);
    return error;
  });

  if (response instanceof Error) {
    return;
  }

  const content = ref("");
  context.value.push({ role: "user", content: localPrompt });
  context.value.push({ role: "assistant", content });

  // @ts-ignore
  for await (const rawChunk of response.body) {
    const chunks = decoder.decode(rawChunk).split("\n");
    for (const chunk of chunks) {
      const message = chunk.trim();
      if (message.length > 0) {
        try {
          content.value += JSON.parse(message.substring(5)).content;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

const promptPlaceholder = computed(() =>
  i18n.value.t(locale.value, "promptPlaceholder"),
);
const submitTitle = computed(() => i18n.value.t(locale.value, "submitTitle"));
const chat = computed(() => context.value.map((message) => message.content));
</script>

<template>
  <div class="chat">
    <DieBestie class="die-bestie" />

    <div class="entries">
      <div v-for="(entry, index) in chat" class="entry">
        <img
          :src="
            index % 2 === 0
              ? user.avatarURL
              : 'https://cdn.discordapp.com/embed/avatars/0.png'
          "
          alt="Avatar"
          class="entry-avatar"
        />
        <div class="entry-text">{{ entry }}</div>
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
