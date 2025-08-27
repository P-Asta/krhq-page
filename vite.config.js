import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      routes: ["/", "/lb", "/submit", "/admin"],
      renderer: new PuppeteerRenderer({
        renderAfterDocumentEvent: "render",
        headless: true,
      }),
    }),
  ],
});
