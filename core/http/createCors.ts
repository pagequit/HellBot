import { frontend } from "@/config.ts";
import { cors } from "@elysiajs/cors";

export function createCors() {
  return cors({
    origin: new URL(frontend.origin).host,
    allowedHeaders: ["Content-Type"],
    credentials: true,
    preflight: true,
  });
}
