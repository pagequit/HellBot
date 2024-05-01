import type { Feature } from "@/core/Feature.ts";
import { http, registerChatInputGuildCommand } from "@/core/mod.ts";
import { auth } from "./auth.ts";
import { httpAuth } from "./httpAuth.ts";

export default ((): void => {
  registerChatInputGuildCommand(auth);
  http.use(httpAuth);
}) satisfies Feature;
