import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
  ];

  // Add Replit cartographer plugin in development mode on Replit
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: {
        clientPort: 443,
      },
    },
  };
})
