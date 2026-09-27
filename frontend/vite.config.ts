import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Only used by `npm run dev` (the Vite dev server). Production builds call
  // the backend directly via VITE_API_BASE (see src/lib/api/client.ts) and
  // never touch this proxy. Override by setting VITE_DEV_PROXY_TARGET in a
  // local .env file if your backend isn't running on the default port.
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:4000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
