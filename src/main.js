import { createApp } from 'vue'
import './style.css'
import router from "./router";
import App from './App.vue'

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

const app = createApp(App);
app.config.errorHandler = (err) => {
  console.error("捕抓到錯誤訊息", err);
};


app.use(router).mount('#app')
