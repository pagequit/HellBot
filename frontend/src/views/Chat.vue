<script setup lang="ts">
import DieBestie from "@/frontend/src/components/icons/DieBestie.vue";
import PaperPlane from "@/frontend/src/components/icons/PaperPlane.vue";
import { ref } from "vue";

const prompt = ref("");
</script>

<template>
  <DieBestie class="die-bestie" />
  <div class="home grid">
    <div class="input col-12">
      <textarea
        class="prompt"
        v-model="prompt"
        placeholder="Enter your prompt here..."
        oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px';"
      ></textarea>
      <button
        type="submit"
        class="paper-plane btn"
        @click.prevent="
          console.log(prompt);
          prompt = '';
        "
      >
        <PaperPlane />
      </button>
    </div>
  </div>
</template>

<style>
.die-bestie {
  color: var(--c-bg-3);
}
.home {
  flex: 1 0 auto;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .input {
    display: flex;
    flex-flow: row nowrap;
    margin: var(--sp-3);
    background: var(--c-bg-1);
    border-radius: var(--sp-2);

    &:has(.prompt:focus) {
      outline-width: 2px;
      outline-style: solid;
      outline-color: var(--c-blurple);
    }

    .prompt {
      color: var(--c-fg-1);
      border-radius: var(--sp-2);
      padding: var(--sp-2);
      background: transparent;
      border: none;
      flex: 1 0 auto;
      resize: none;

      &:focus {
        outline: none;
      }
    }
  }
  .paper-plane {
    flex: 0 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;

    svg {
      transform: rotate(90deg);
    }
  }
}
</style>
