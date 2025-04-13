import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      leaflet: "leaflet/dist/leaflet.js",
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0', 
  },
});