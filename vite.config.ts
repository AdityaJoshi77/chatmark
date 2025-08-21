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
        ],
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          background: resolve(__dirname, "src/background/index.ts"),
          content: resolve(__dirname, "src/content/content-entry.tsx"),
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === "background") return "background/index.js";
            if (chunk.name === "content") return "content/index.js";
            return "assets/[name].js";
          },
          format: "esm", // ✅ Use ESM instead of IIFE
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
