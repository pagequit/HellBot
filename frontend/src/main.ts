import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/app.css";
import { origin } from "./composables/origin.ts";
import router from "./router";

fetch(`${origin}/auth/user`, {
  credentials: "include",
  mode: "cors",
})
  .then((res) => res.json())
  .then(({ data }) => {
    const app = createApp(App, {
      avatarURL: data.avatarURL,
      displayName: data.displayName,
    });

    app.use(createPinia());
    app.use(router);

    app.mount("#app");
  });
