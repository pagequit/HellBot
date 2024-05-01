import { URL, fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

export default ({ mode }: { mode: string }) => {
  process.env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [vue()],
    server: {
      port: 3080,
    },
    root: "./frontend",
    resolve: {
      alias: {
        "@/": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  });
};
