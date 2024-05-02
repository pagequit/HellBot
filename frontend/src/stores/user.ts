import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export type User = {
  avatarURL: Ref<string>;
  displayName: Ref<string>;
};

export const useUser = defineStore("user", (): User => {
  const avatarURL = ref("https://cdn.discordapp.com/embed/avatars/0.png");
  const displayName = ref("User");

  return { avatarURL, displayName };
});
