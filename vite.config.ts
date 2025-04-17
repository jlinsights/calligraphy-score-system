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
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    chunkSizeWarningLimit: 800,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: (id) => {
          // 주요 라이브러리들을 별도의 청크로 분리
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('lucide') || id.includes('recharts') || id.includes('cmdk')) {
              return 'vendor-ui';
            }
            // 나머지 node_modules는 기타 벤더 청크로 분리
            return 'vendor-others';
          }
          // UI 컴포넌트들을 하나의 청크로 묶음
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
        }
      }
    }
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
