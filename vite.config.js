import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
export default defineConfig({
	base: "/vite/demo",
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@layouts": path.resolve(__dirname, "./src/jsx/layouts"),
			"@components": path.resolve(__dirname, "./src/jsx/components"),
			"@pages": path.resolve(__dirname, "./src/jsx/pages"),
			"@store": path.resolve(__dirname, "./src/jsx/store"),
		},
	},
});
