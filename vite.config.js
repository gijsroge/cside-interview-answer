import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import Icons from "unplugin-icons/vite";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({ autoCodeSplitting: true }),
		Icons({
			compiler: "jsx",
			jsx: "react",
			autoInstall: true,
		}),
		viteReact({
			babel: {
				plugins: [
					[
						"babel-plugin-react-compiler",
						{ runtimeModule: "react-compiler-runtime" },
					],
				],
			},
		}),
		tailwindcss(),
		relay,
	],
	test: {
		globals: true,
		environment: "jsdom",
	},
	build: {
		chunkSizeWarningLimit: 1000,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
