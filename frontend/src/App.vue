<script setup lang="ts">
import { origin } from "@/frontend/src/composables/origin.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user";
import Auth from "@/frontend/src/views/Auth.vue";
import Index from "@/frontend/src/views/Index.vue";
import Loading from "@/frontend/src/views/Loading.vue";
import { Transition, ref } from "vue";

document.body.classList.add(useSettings().theme);

const componentName = ref<"Auth" | "Index" | "Loading">("Loading");
const components = {
  Auth,
  Index,
  Loading,
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
    <component :is="components[componentName]" />
  </Transition>
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
</style>
