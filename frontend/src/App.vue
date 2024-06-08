<script setup lang="ts">
import { origin } from "@/frontend/src/composables/origin.ts";
import { useSettings } from "@/frontend/src/stores/settings.ts";
import { useUser } from "@/frontend/src/stores/user";
import Auth from "@/frontend/src/views/Auth.vue";
import Index from "@/frontend/src/views/Index.vue";
import { ref } from "vue";

document.body.classList.add(useSettings().theme);

const componentName = ref<"Auth" | "Index">("Auth");
const components = {
  Auth,
  Index,
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
  });
</script>

<template>
  <component :is="components[componentName]"></component>
</template>
