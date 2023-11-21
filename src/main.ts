import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import Layui from '@layui/layui-vue'
import 'virtual:svg-icons-register'

import '@layui/layui-vue/lib/index.css'
import '@/assets/css/styles.scss'

import elementPlus from './utils/elementPlus'

const app = createApp(App)

app.use(Layui)
app.use(elementPlus)
app.use(router)
app.mount('#app')
