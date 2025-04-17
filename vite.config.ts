import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: (id) => {
          // 주요 UI 프레임워크 분리
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          // React 및 관련 라이브러리 분리
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-react';
          }
          // 차트 및 PDF 관련 라이브러리
          if (id.includes('node_modules/jspdf') || 
              id.includes('node_modules/html2canvas') || 
              id.includes('node_modules/recharts')) {
            return 'vendor-charts-pdf';
          }
          // 유틸리티 라이브러리
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/class-variance-authority')) {
            return 'vendor-utils';
          }
          // 다른 모든 node_modules
          if (id.includes('node_modules')) {
            return 'vendor-others';
          }
          // 컴포넌트 분리
          if (id.includes('/components/')) {
            // UI 컴포넌트
            if (id.includes('/components/ui/')) {
              return 'ui-components';
            }
            return 'components';
          }
        },
        // 파일명 규칙 설정
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
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
    react() as PluginOption,
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
  ] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
