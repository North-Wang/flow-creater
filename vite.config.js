import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias:{
     '@': resolve(__dirname, 'src'),
    }
  },
  vite:{
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/assets/styles/main.scss" as *;`
        }
      }
    }
  }
    
})
