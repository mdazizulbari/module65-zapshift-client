import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000, // Change to your desired port
    host: "localhost", // Optional: specify host (e.g., '0.0.0.0' for external access)
    open: true, // Optional: auto-open browser
  },
});
