import { URL, fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

export default ({ mode }: { mode: string }) => {
  process.env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [vue()],
    root: "./frontend",
    resolve: {
      alias: {
        "@/frontend": fileURLToPath(new URL("./frontend", import.meta.url)),
        "@/core": fileURLToPath(new URL("./core", import.meta.url)),
      },
    },
  });
};
