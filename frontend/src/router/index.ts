import Chats from "@/frontend/src/views/chat/Chats.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "chats",
      component: Chats,
    },
    {
      path: "/commands",
      name: "commands",
      component: () => import("@/frontend/src/views/Commands.vue"),
    },
  ],
});

export default router;
