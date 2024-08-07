<script setup lang="ts">
import Toast from "@/frontend/src/components/Toast.vue";
import { origin } from "@/frontend/src/composables/origin.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useToasts } from "@/frontend/src/stores/toasts.ts";
import { useUser } from "@/frontend/src/stores/user";
import Auth from "@/frontend/src/views/Auth.vue";
import Index from "@/frontend/src/views/Index.vue";
import Loading from "@/frontend/src/views/Loading.vue";
import { storeToRefs } from "pinia";
import { Transition, ref } from "vue";

document.body.classList.add(useSettings().theme);

const componentName = ref<"Auth" | "Index" | "Loading">("Loading");
const components = {
  Auth,
  Index,
  Loading,
};

const t = useToasts();
const { toasts } = storeToRefs(t);

fetch(`${origin}/auth/user`, {
  credentials: "include",
  mode: "cors",
})
  .then((response: Response) => {
    return response.json();
  })
  .then(({ data }: { data: { avatarURL: string; displayName: string } }) => {
    const user = useUser();
    user.avatarURL = data.avatarURL;
    user.displayName = data.displayName;
    componentName.value = "Index";
  })
  .catch((error) => {
    componentName.value = "Auth";
    console.error(error);
    t.makeAToast(error.message, "error");
  });
</script>

<template>
  <Transition name="fade">
    <component :is="components[componentName]" />
  </Transition>

  <div class="toasts">
    <TransitionGroup name="fade" tag="div">
      <Toast
        v-for="[key, { id, message, type }] in toasts"
        :key="key"
        :id="id"
        :message="message"
        :type="type"
      />
    </TransitionGroup>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 233ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toasts {
  position: fixed;
  bottom: var(--sp-3);
  right: var(--sp-3);
  z-index: 999;
  overflow-y: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  gap: var(--sp-3);
}
</style>
