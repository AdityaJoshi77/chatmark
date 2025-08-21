import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // DEV: Serve root UI for testing
  if (command === "serve") {
    return {
      plugins: [react(),tailwindcss()],
      root: ".", // root index.html
      server: {
        port: 5173,
      },
    };
  }

  // BUILD: Chrome extension build
  return {
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          { src: "manifest.json", dest: "." },
          { src: "public/icons/*", dest: "icons" },
          { src: "src/content/styles.css", dest: "content" },
          { src: "src/popup/index.html", dest: "popup" },
        ],
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          background: resolve(__dirname, "src/background/index.ts"),
          content: resolve(__dirname, "src/content/index.ts"),
          popup: resolve(__dirname, "src/popup/main.tsx"),
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === "background") return "background/index.js";
            if (chunk.name === "content") return "content/index.js";
            if (chunk.name === "popup") return "assets/popup.js";
            return "assets/[name].js";
          },
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
