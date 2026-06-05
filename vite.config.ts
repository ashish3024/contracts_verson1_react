import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMockFallback = env.VITE_USE_MOCKS === 'true'

  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      proxy: useMockFallback
        ? undefined
        : {
            '/api': {
              target: env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
              changeOrigin: true,
            },
          },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  })
}
