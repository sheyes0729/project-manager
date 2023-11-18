import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import Layui from '@layui/layui-vue'
import 'virtual:svg-icons-register'

import '@layui/layui-vue/lib/index.css'
import '@/assets/css/styles.scss'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

const app = createApp(App)
app.use(router)
app.use(Layui)
app.mount('#app')
