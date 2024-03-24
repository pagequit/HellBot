<script setup lang="ts">
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import { ref } from "vue";

const prompt = ref("");
</script>

<template>
  <div class="chat">
    <DieBestie class="die-bestie" />
    <div class="prompt">
      <textarea class="prompt-input" v-model="prompt" placeholder="Enter your prompt here..."
        oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px';"></textarea>
      <button type="submit" class="prompt-submit btn" @click.prevent="console.log(prompt); prompt = '';">
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
}

.die-bestie {
  color: var(--c-bg-3);
}

.prompt {
  display: flex;
  flex-flow: row nowrap;
  margin: var(--sp-3) 0;
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
