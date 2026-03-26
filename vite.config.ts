import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild }) => ({
	build: isSsrBuild
		? { rollupOptions: { input: { index: './worker/index.ts' } } }
		: undefined,
	plugins: [cloudflareDevProxy(), vanillaExtractPlugin(), reactRouter()],
}));
