import { ElTabs, ElTabPane, ElDialog } from 'element-plus'
import 'element-plus/es/components/tabs/style/css'
import 'element-plus/es/components/tab-pane/style/css'
import 'element-plus/es/components/dialog/style/css'
import { App } from 'vue'

export default {
  install: (app: App) => {
    app.component(ElTabs.name, ElTabs)
    app.component(ElTabPane.name, ElTabPane)
    app.component(ElDialog.name, ElDialog)
  }
}
