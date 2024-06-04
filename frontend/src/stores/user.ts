import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export type User = {
  avatarURL: Ref<string>;
  displayName: Ref<string>;
};

export const useUser = defineStore("user", (): User => {
  const avatarURL = ref("/derPlatzhalter.png");
  const displayName = ref("User");

  return { avatarURL, displayName };
});
