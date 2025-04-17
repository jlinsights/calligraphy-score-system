import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015',
    modulePreload: false,
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
            'react-router-dom'
          ]
        }
      }
    }
  },
  plugins: [
    react() as PluginOption,
    {
      name: 'copy-files',
      closeBundle() {
        // CNAME 파일을 dist 디렉토리로 복사
        if (fs.existsSync('CNAME')) {
          fs.copyFileSync('CNAME', 'dist/CNAME');
          console.log('CNAME file copied to dist directory');
        }
        
        // 404.html 파일 생성 (GitHub Pages용)
        if (!fs.existsSync('dist/404.html')) {
          fs.copyFileSync('dist/index.html', 'dist/404.html');
          console.log('404.html file created');
        }
      }
    } as PluginOption
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
