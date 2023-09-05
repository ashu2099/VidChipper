import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), crossOriginIsolation()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
});
