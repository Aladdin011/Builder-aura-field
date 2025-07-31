import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          react: ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          
          // Animation libraries
          animation: ['framer-motion', 'motion'],
          
          // 3D graphics
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          
          // Charts and visualization
          charts: ['recharts'],
          
          // Form handling
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data fetching
          query: ['@tanstack/react-query', 'axios'],
          
          // Utilities
          utils: [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'date-fns',
            'lucide-react',
            'sonner',
            'cmdk',
            'input-otp',
            'next-themes',
            'zustand'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild'
  }
}));
