import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from "vite-plugin-source-identifier"
import { VitePWA } from "vite-plugin-pwa"

const isProd = process.env.BUILD_MODE === "prod"
export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: "data-matrix",
      includeProps: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "AICompass — AI 입문 가이드",
        short_name: "AICompass",
        description: "AI를 처음 시작하는 모든 분을 위한 실시간 가이드",
        theme_color: "#2563eb",
        background_color: "#f9fafb",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/openrouter\.ai\/api\//i,
            handler: "NetworkFirst",
            options: { cacheName: "openrouter-api", expiration: { maxAgeSeconds: 3600 } }
          },
          {
            urlPattern: /^https:\/\/github\.com\//i,
            handler: "NetworkFirst",
            options: { cacheName: "github-api", expiration: { maxAgeSeconds: 86400 } }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
