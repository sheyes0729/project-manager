import { createApp } from 'vue'
import App from './App.vue'
import ViewUiPlus from 'view-ui-plus'

import 'view-ui-plus/dist/styles/viewuiplus.css'
import '@renderer/assets/css/styles.scss'

const app = createApp(App)
app.use(ViewUiPlus, {
  transfer: true
})
app.mount('#app')
