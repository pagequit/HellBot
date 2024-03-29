import { URL, fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vue()],
	root: "./frontend",
	resolve: {
		alias: {
			"@/frontend": fileURLToPath(new URL("./frontend", import.meta.url)),
			"@/core": fileURLToPath(new URL("./core", import.meta.url)),
		},
	},
});
