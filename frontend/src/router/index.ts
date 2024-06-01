import Index from "@/frontend/src/views/Index.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
    },
    {
      path: "/chats",
      name: "chats",
      component: () => import("@/frontend/src/views/chat/Chats.vue"),
    },
    {
      path: "/commands",
      name: "commands",
      component: () => import("@/frontend/src/views/Commands.vue"),
    },
  ],
});

router.beforeEach(async () => {});

export default router;
