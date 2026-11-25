import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const base = (process.env.BASE_PATH || '').replace(/\/$/, '') + '/'

// The 3D scenes, fonts-free assets and the favicon are shared with the static site in ../public.
export default defineConfig({
  base,
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, host: true },
})
