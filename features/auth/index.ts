import type { Feature } from "@/core/Feature.ts";
import { http, registerChatInputCommand } from "@/core/mod.ts";
import { auth } from "./auth.ts";
import { httpAuth } from "./httpAuth.ts";

export default ((): void => {
  registerChatInputCommand(auth);
  http.use(httpAuth);
}) satisfies Feature;
