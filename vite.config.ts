import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
            'react-router-dom'
          ]
        }
      }
    },
    modulePreload: false
  },
  optimizeDeps: {
    exclude: ['lovable-tagger']
  },
  server: {
    host: "::",
    port: 8082,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'copy-cname',
      closeBundle() {
        // CNAME 파일을 dist 디렉토리로 복사
        if (fs.existsSync('CNAME')) {
          fs.copyFileSync('CNAME', 'dist/CNAME');
          console.log('CNAME file copied to dist directory');
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
