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
        name: "AI이것만 — AI 모델 비교·추천·가격·뉴스",
        short_name: "AI이것만",
        description: "국내 AI 서비스 최신 현황을 한눈에 — 모델 탐색·가격 비교·뉴스·프롬프트",
        theme_color: "#5B5FEF",
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
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/i,
            handler: "NetworkFirst",
            options: { cacheName: "onlyai-data", expiration: { maxAgeSeconds: 3600 } }
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
