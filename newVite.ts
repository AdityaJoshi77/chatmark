
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      plugins: [react(), tailwindcss()],
      root: ".",
      server: { port: 5173 },
    };
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          { src: "manifest.json", dest: "." },
          { src: "public/icons/*", dest: "icons" },
          // Add this target to copy popup.html to the 'popup' folder in the dist directory
          { src: "src/popup/popup.html", dest: "popup" },
        ],
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          // Add the popup.tsx file as a new entry point
          content: resolve(__dirname, "src/content/content-entry.tsx"),
          popup: resolve(__dirname, "src/popup/popup.tsx"),
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === "content") return "content/index.js";
            // Check for the 'popup' chunk and place it in the assets folder
            if (chunk.name === "popup") return "assets/popup.js";
            return "assets/[name].js";
          },
          format: "esm",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
