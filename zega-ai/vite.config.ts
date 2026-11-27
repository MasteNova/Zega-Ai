import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Zega-AI — Arba Minch Travel Assistant',
        short_name: 'Zega-AI',
        description: 'AI itineraries, maps, fair fares, Gamo phrases and SOS for Arba Minch, Ethiopia.',
        theme_color: '#193C32',
        background_color: '#F5F0E5',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Plan a trip', url: '/planner' },
          { name: 'Safety / SOS', url: '/safety' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'zega-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 120, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/phrase-audio\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'zega-audio', expiration: { maxEntries: 100, maxAgeSeconds: 2592000 } }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/destinations\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'zega-images', expiration: { maxEntries: 120, maxAgeSeconds: 2592000 } }
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'zega-tiles', expiration: { maxEntries: 600, maxAgeSeconds: 2592000 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'zega-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 31536000 } }
          }
        ]
      }
    })
  ]
});
