<script setup lang="ts">
import { layer } from '@layui/layui-vue'

const SettingItem = defineAsyncComponent(() => import('./setting-item.vue'))

const { system, setSystem, file } = useStore()

const defaultForm = {
  title: '',
  include: '',
  exclude: '',
  ide: '',
  icon: ''
}

const form = ref(defaultForm)

const typeList = ref(system.value.typeList || [])

watch(
  typeList,
  (list) => {
    setSystem(list, 'typeList')
  },
  {
    deep: true
  }
)

const groupList = ref(system.value.groupList || [])

watch(
  groupList,
  (list) => {
    setSystem(list, 'groupList')
  },
  {
    deep: true
  }
)

const fileList = ref(file.value.list || [])

const editorList = computed(() => system.value.editorList || [])

const scanCategory = ref(system.value.scanCategory || 'cover')

const displayMode = ref(system.value.displayMode || 'list')

function scanCategoryChange(current: string) {
  scanCategory.value = current
  setSystem(scanCategory.value, 'scanCategory')
}

function displayModeChange(current: string) {
  displayMode.value = current
  setSystem(displayMode.value, 'displayMode')
}

const dialogVisible = ref(false)
function addCategory() {
  form.value = defaultForm
  dialogVisible.value = true
}

function confirmAdd() {
  if (typeList.value.find((item) => item.title === form.value.title)) {
    layer.notifiy({
      title: '提示！',
      content: '名称已存在！',
      icon: 2
    })
    return
  }
  layer.notifiy({
    title: '提示！',
    content: '添加成功！',
    icon: 1
  })
  typeList.value.unshift(form.value)
  dialogVisible.value = false
}

function editCategory(title: string) {
  form.value = typeList.value.find((item) => item.title === title)
  dialogVisible.value = true
}

function removeCategory(title: string) {
  layer.confirm('确定删除选中项？', {
    title: '确认删除',
    btn: [
      {
        text: '确定',
        callback: (id) => {
          typeList.value = typeList.value.filter((item) => item.title !== title)
          layer.notifiy({
            title: '提示！',
            content: '删除成功！',
            icon: 1
          })
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id)
        }
      }
    ]
  })
}

const defaultGroupForm = {
  title: '',
  files: []
}
const groupForm = ref(defaultGroupForm)
const groupVisible = ref(false)

function addGroup() {
  groupForm.value = defaultGroupForm
  groupVisible.value = true
}

function confirmAddGroup() {
  if (groupList.value.find((item) => item.title === groupForm.value.title)) {
    layer.notifiy({
      title: '提示！',
      content: '名称已存在！',
      icon: 2
    })
    return
  }
  layer.notifiy({
    title: '提示！',
    content: '添加成功！',
    icon: 1
  })
  groupList.value.unshift(groupForm.value)
  groupVisible.value = false
}

function editGroup(title: string) {
  groupForm.value = groupList.value.find((item) => item.title === title)
  groupVisible.value = true
}

function removeGroup(title: string) {
  layer.confirm('确定删除选中项？', {
    title: '确认删除',
    btn: [
      {
        text: '确定',
        callback: (id) => {
          groupList.value = groupList.value.filter((item) => item.title !== title)
          layer.notifiy({
            title: '提示！',
            content: '删除成功！',
            icon: 1
          })
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id) => {
          layer.close(id)
        }
      }
    ]
  })
}
</script>

<template>
  <SettingItem title="项目配置">
    <lay-form label-width="120px" label-position="right" size="sm">
      <lay-form-item label="类型绑定">
        <lay-space direction="vertical">
          <lay-space v-for="tp in typeList" :key="tp.title">
            <lay-input v-model="tp.title" disabled />
            <RippleButton type="normal" size="xs" @click="editCategory(tp.title)">
              <lay-icon type="layui-icon-edit" />
            </RippleButton>
            <RippleButton type="danger" size="xs" @click="removeCategory(tp.title)">
              <lay-icon type="layui-icon-subtraction" />
            </RippleButton>
          </lay-space>
          <RippleButton type="primary" icon="layui-icon-addition" @click="addCategory"
            >添加类型</RippleButton
          >
        </lay-space>
      </lay-form-item>
      <lay-form-item label="扫描策略">
        <lay-radio-group v-model="scanCategory" @change="scanCategoryChange">
          <lay-radio value="cover"> 覆盖 </lay-radio>
          <lay-radio value="merge"> 合并 </lay-radio>
        </lay-radio-group>
      </lay-form-item>
      <lay-form-item label="分组管理">
        <lay-space direction="vertical">
          <lay-space v-for="gp in groupList" :key="gp.title">
            <lay-input v-model="gp.title" disabled />
            <RippleButton type="normal" size="xs" @click="editGroup(gp.title)">
              <lay-icon type="layui-icon-edit" />
            </RippleButton>
            <RippleButton type="danger" size="xs" @click="removeGroup(gp.title)">
              <lay-icon type="layui-icon-subtraction" />
            </RippleButton>
          </lay-space>
          <RippleButton type="primary" icon="layui-icon-addition" @click="addGroup"
            >添加分组</RippleButton
          >
        </lay-space>
      </lay-form-item>
      <lay-form-item label="展示方式">
        <lay-radio-group v-model="displayMode" @change="displayModeChange">
          <lay-radio value="list"> 列表 </lay-radio>
          <lay-radio value="group"> 分组 </lay-radio>
        </lay-radio-group>
      </lay-form-item>
    </lay-form>
  </SettingItem>
  <el-dialog v-model="dialogVisible" title="项目类型">
    <lay-form :model="form">
      <lay-form-item label="名称">
        <lay-input v-model="form.title" placeholder="输入类型名称" />
      </lay-form-item>

      <lay-form-item label="包括">
        <lay-input v-model="form.include" placeholder="多个文件用空格隔开" />
      </lay-form-item>

      <lay-form-item label="排除">
        <lay-input v-model="form.exclude" placeholder="多个文件用空格隔开" />
      </lay-form-item>

      <lay-form-item label="图标">
        <lay-icon-picker v-model="form.icon" />
      </lay-form-item>

      <lay-form-item label="绑定编辑器">
        <lay-select v-model="form.ide" placeholder="选择编辑器" allow-clear>
          <lay-select-option
            v-for="item in editorList"
            :key="item.path"
            :value="item.path"
            :label="item.path"
          >
            <lay-space>
              <img :src="item.icon" alt="" width="24" height="24" />
              <span>{{ item.path }}</span>
            </lay-space>
          </lay-select-option>
        </lay-select>
      </lay-form-item>
    </lay-form>
    <template #footer>
      <lay-space>
        <lay-button size="sm" @click="dialogVisible = false">取消</lay-button>
        <lay-button type="primary" size="sm" @click="confirmAdd">确定</lay-button>
      </lay-space>
    </template>
  </el-dialog>

  <el-dialog v-model="groupVisible" title="项目分组">
    <lay-form :model="groupForm" label-position="right">
      <lay-form-item label="分组名称">
        <lay-input v-model="groupForm.title" />
      </lay-form-item>
    </lay-form>

    <lay-form-item label="绑定项目">
      <lay-select v-model="groupForm.files" show-search multiple placeholder="选择项目" allow-clear>
        <lay-select-option
          v-for="item in fileList"
          :key="item.directory"
          :value="item.directory"
          :label="item.projectName"
        >
        </lay-select-option>
      </lay-select>
    </lay-form-item>

    <template #footer>
      <lay-space>
        <lay-button size="sm" @click="groupVisible = false">取消</lay-button>
        <lay-button type="primary" size="sm" @click="confirmAddGroup">确定</lay-button>
      </lay-space>
    </template>
  </el-dialog>
</template>
