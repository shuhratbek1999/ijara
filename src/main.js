import Antd, { Button, message } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import axios from "axios";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./css/style.css";
import router from "./router";
import SocketioService from "./socketio/index";
const app = createApp(App);
let BASE_URL = "http://176.53.163.29:7005/api/v1/admin-app/",
  // let BASE_URL = "http://localhost:5000/api/v1/admin-app/",
  Bearer = "Bearer ";
axios.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = Bearer + localStorage.getItem("token");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
app.provide("socket", SocketioService);
axios.defaults.baseURL = BASE_URL;
// app.component(Layout.name,Layout)
app.config.globalProperties.$message = message;
app.config.globalProperties.$buttons = Button;
const pinia = createPinia();
// app.use(Gauth,gAuthOptions)
app.use(router);
app.use(pinia);
app.use(Antd);
app.provide("BASE_URL", BASE_URL);
app.mount("#app");
