<script setup lang="ts">
import { origin } from "@/frontend/src/composables/origin.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user";
import Auth from "@/frontend/src/views/Auth.vue";
import Index from "@/frontend/src/views/Index.vue";
import Loader from "@/frontend/src/views/Loader.vue";
import { Transition, ref } from "vue";

document.body.classList.add(useSettings().theme);

const componentName = ref<"Auth" | "Index" | "Loader">("Loader");
const components = {
  Auth,
  Index,
  Loader,
};

fetch(`${origin}/auth/user`, {
  credentials: "include",
  mode: "cors",
})
  .then((response: Response) => response.json())
  .then(({ data }: { data: { avatarURL: string; displayName: string } }) => {
    const user = useUser();
    user.avatarURL = data.avatarURL;
    user.displayName = data.displayName;
    componentName.value = "Index";
  })
  .catch((error) => {
    console.error(error);
    componentName.value = "Auth";
  });
</script>

<template>
  <Transition name="fade">
    <component :is="components[componentName]"></component>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 359ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
