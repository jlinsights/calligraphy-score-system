import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
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
        
        // PWA 관련 파일들 복사
        if (fs.existsSync('public/sw.js')) {
          fs.copyFileSync('public/sw.js', 'dist/sw.js');
          console.log('Service Worker file copied to dist directory');
        }
        
        if (fs.existsSync('public/manifest.json')) {
          fs.copyFileSync('public/manifest.json', 'dist/manifest.json');
          console.log('Manifest file copied to dist directory');
        }
        
        // icons 폴더 복사
        if (fs.existsSync('public/icons')) {
          if (!fs.existsSync('dist/icons')) {
            fs.mkdirSync('dist/icons');
          }
          
          const iconFiles = fs.readdirSync('public/icons');
          iconFiles.forEach(file => {
            fs.copyFileSync(`public/icons/${file}`, `dist/icons/${file}`);
          });
          console.log('Icon files copied to dist/icons directory');
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
