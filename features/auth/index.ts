import type { Feature } from "@/core/Feature.ts";
import { registerChatInputCommand } from "@/core/discord/registerCommand.ts";
import { http } from "@/core/http/http.ts";
import { auth } from "./auth.ts";
import { httpAuth } from "./httpAuth.ts";

export default ((): void => {
  registerChatInputCommand(auth);
  http.use(httpAuth);
}) satisfies Feature;
