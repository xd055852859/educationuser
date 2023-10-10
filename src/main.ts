import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { registerStore } from "@/store";
import router from "@/router";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./styles/common/index.scss";
import "./styles/element/index.scss";
import "element-plus/dist/index.css";

const app = createApp(App);
dayjs.extend(duration)
app.provide("dayjs", dayjs);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(pinia)
registerStore();
app.mount("#app");
