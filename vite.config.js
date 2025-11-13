import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
            "@/components": path.resolve(
                __dirname,
                "./resources/js/components"
            ),
            "@/layouts": path.resolve(__dirname, "./resources/js/Layouts"),
            "@/pages": path.resolve(__dirname, "./resources/js/Pages"),
            "@/lib": path.resolve(__dirname, "./resources/js/lib"),
        },
    },
    optimizeDeps: {
        include: ["lucide-react"],
    },
    build: {
        sourcemap: false, // Matikan sourcemap untuk production
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    inertia: ["@inertiajs/react"],
                    charts: ["recharts"],
                    lucide: ["lucide-react"],
                },
            },
        },
    },
});
