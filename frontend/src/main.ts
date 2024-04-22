import "./assets/app.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

fetch("http://localhost:8080/", {
  credentials: "include",
  mode: "cors",
})
  .then((res) => res.json())
  .then(({ data }) => {
    console.log(data);

    const app = createApp(App, {
      avatarURL: data.avatarURL,
      displayName: data.displayName,
    });

    app.use(createPinia());
    app.use(router);

    app.mount("#app");
  });
