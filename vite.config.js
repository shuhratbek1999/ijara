import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src", // `@` ni `src` papkasiga yo‘naltirish
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
