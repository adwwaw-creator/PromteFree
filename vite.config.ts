
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = '/ArabPromptdawAi/';

const rootDir = path.dirname(
  fileURLToPath(import.meta.url)
);

export default defineConfig({
  base,

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      manifest: {
        name: 'Arabiprompt AI Studio',
        short_name: 'Arabiprompt',

        description:
          'منصة عربية احترافية لهندسة الأوامر وإنشاء البرومبتات',

        lang: 'ar',
        dir: 'rtl',

        start_url: base,
        scope: base,

        display: 'standalone',

        background_color: '#ffffff',
        theme_color: '#000000',

        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        maximumFileSizeToCacheInBytes:
          5 * 1024 * 1024,

        globPatterns: [
          '**/*.{js,css,html,png,jpg,jpeg,svg,ico,webp,woff,woff2}',
        ],

        navigateFallback: 'index.html',
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],

  resolve: {
    alias: {
      '@': rootDir,
    },

    dedupe: [
      'react',
      'react-dom',
    ],
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
    ],
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 800,
  },

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
