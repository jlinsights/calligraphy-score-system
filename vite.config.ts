import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    target: 'es2015', // 더 넓은 브라우저 호환성
    modulePreload: false, // 모듈 프리로드 비활성화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 디버깅을 위해 콘솔 유지
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
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
          ],
          'ui': [
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ]
        },
        // 파일명 규칙 설정
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 소스맵 생성 (디버깅용)
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['lovable-tagger'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    host: "::",
    port: 8082,
  },
  plugins: [
    react({
      jsxImportSource: undefined,
      tsDecorators: true,
    }) as PluginOption,
    {
      name: 'copy-cname',
      closeBundle() {
        // CNAME 파일을 dist 디렉토리로 복사
        if (fs.existsSync('CNAME')) {
          fs.copyFileSync('CNAME', 'dist/CNAME');
          console.log('CNAME file copied to dist directory');
        }
        
        // 404.html 파일 생성 (GitHub Pages용)
        if (!fs.existsSync('dist/404.html')) {
          fs.copyFileSync('dist/index.html', 'dist/404.html');
          console.log('404.html file created in dist directory');
        }
      }
    },
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // 필요한 경우 추가 HTML 변환 수행
        return html;
      }
    }
  ] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
