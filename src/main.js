import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import router from "./router";
import App from "./App.vue";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err) => {
  console.error("捕抓到錯誤訊息", err);
};

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount("#app");
