import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Basic Vite config, the react plugin is needed so Vite understands JSX.
export default defineConfig({
    plugins: [react()],
});
