import { createApp } from 'vue'
import App from './App.vue'
import ViewUiPlus from 'view-ui-plus'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import 'virtual:svg-icons-register'

import '@/assets/css/styles.scss'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import '@/assets/css/viewui-override.less'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  routes,
  history: createWebHashHistory()
})

const app = createApp(App)
app.use(ViewUiPlus, {
  transfer: true
})
app.use(router)
app.mount('#app')
