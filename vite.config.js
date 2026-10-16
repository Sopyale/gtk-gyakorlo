import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/gtk-gyakorlo/',
  // Shown in the footer so anyone can tell which deploy their browser is running.
  define: { __VERSION__: JSON.stringify((process.env.GITHUB_SHA || 'helyi').slice(0, 7)) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      manifest: {
        name: 'GTK gyakorló',
        short_name: 'Gyakorló',
        description: 'Gyakorló kérdésbank az ELTE GTK első féléves tárgyaihoz',
        lang: 'hu',
        theme_color: '#140b13',
        background_color: '#140b13',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
