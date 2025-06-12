import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  vite:{
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/assets/styles/main.scss" as *;`
        }
      }
    }
  },
   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 將 @ 指到 /src
    }
  }
    
})
