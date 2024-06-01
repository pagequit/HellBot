import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/app.css";
import { origin } from "./composables/origin.ts";
import router from "./router";

function signIn(): Promise<Response> {
  return fetch(`${origin}/auth/user`, {
    credentials: "include",
    mode: "cors",
  });
  // .then((res) => res.json())
  // .then(({ data }) => {
  //   const app = createApp(App, {
  //     avatarURL: data.avatarURL,
  //     displayName: data.displayName,
  //   });

  //   app.use(createPinia());
  //   app.use(router);

  //   app.mount("#app");
  // });
}

const signInTemplate = document.createElement("div");
signInTemplate.innerHTML = `
<div class="input-group>
  <label class="input-label">Auth Token</label>
  <input class="input" type="text" />
</div>
`;

const appContainer = document.getElementById("app") as HTMLElement;
appContainer.appendChild(signInTemplate);
