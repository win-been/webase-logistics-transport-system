import { createApp } from 'vue'
import "element-plus/theme-chalk/el-loading.css"
import "element-plus/theme-chalk/el-message.css"
import "element-plus/theme-chalk/el-notification.css"

import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8002'
axios.defaults.withCredentials = true

const app = createApp(App)
app.use(router)
app.mount('#app')
