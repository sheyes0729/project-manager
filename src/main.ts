import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import Layui from '@layui/layui-vue'
import 'virtual:svg-icons-register'

import '@layui/layui-vue/lib/index.css'
import '@/assets/css/styles.scss'

const app = createApp(App)
app.use(router)
app.use(Layui)
app.mount('#app')
