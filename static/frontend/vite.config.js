import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    plugins: [react()],
    root: ".",
    // For production build, set base to Flask static path
    // For dev server, use root
    base: isBuild ? "/static/frontend/dist/" : "/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
    },
    server: {
      port: 5173,
      strictPort: false,
      open: false,
    },
  };
});

