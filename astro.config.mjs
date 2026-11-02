import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://frete-rapido-curitiba.netlify.app",
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
