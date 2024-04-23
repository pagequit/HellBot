import Chat from "@/frontend/src/views/chat/Chat.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "chat",
      component: Chat,
    },
    {
      path: "/commands",
      name: "commands",
      component: () => import("@/frontend/src/views/Commands.vue"),
    },
  ],
});

export default router;
