<script setup lang="ts">
import { LayForm, layer } from '@layui/layui-vue'
import { nanoid } from 'nanoid'

const SettingItem = defineAsyncComponent(() => import('./setting-item.vue'))

interface Tag {
  id: string
  title: string
  color: string
  backgroundColor: string
}

const { todo, setTodo } = useStore()
const tagList = ref<Tag[]>(todo.value.tagList || [])
const visible = ref(false)
const title = ref('')
const form = ref<Tag>(defaultForm())
const formRef = shallowRef<InstanceType<typeof LayForm>>()

watch(
  tagList,
  (tl) => {
    setTodo(tl, 'tagList')
  },
  {
    deep: true
  }
)

function defaultForm() {
  return {
    id: nanoid(),
    title: '',
    color: '#009688',
    backgroundColor: '#009688'
  }
}

function addTag() {
  title.value = '新增标签'
  form.value = defaultForm()
  visible.value = true
}

function editTag(tag: Tag) {
  title.value = '编辑标签'
  form.value = tag
  visible.value = true
}

function deleteTag(tag: Tag) {
  tagList.value.filter((item) => item.id !== tag.id)
  layer.notifiy({
    title: '提示',
    icon: 1,
    content: '删除成功！'
  })
}

function confirm() {
  formRef.value?.validate((isValidate) => {
    if (!isValidate) return
    if (title.value.includes('新增')) {
      if (tagList.value.find((item) => item.title === form.value!.title)) {
        layer.notifiy({
          title: '提示！',
          content: '名称已存在！',
          icon: 2
        })
        return
      }
      tagList.value.unshift(form.value!)
      layer.notifiy({
        title: '提示！',
        content: '添加成功！',
        icon: 1
      })
    } else {
      tagList.value.splice(
        tagList.value.findIndex((item) => item.id === form.value!.id),
        1,
        form.value!
      )
      layer.notifiy({
        title: '提示！',
        content: '修改成功！',
        icon: 1
      })
    }
    visible.value = false
  })
}
</script>

<template>
  <SettingItem title="待办配置">
    <lay-form label-width="120px">
      <lay-form-item label="标签管理">
        <lay-space direction="vertical">
          <lay-space v-for="item in tagList" :key="item.title">
            <lay-input v-model="item.title" disabled />
            <RippleButton type="normal" size="xs" @click="editTag(item)">
              <lay-icon type="layui-icon-edit" />
            </RippleButton>
            <RippleButton type="danger" size="xs" @click="deleteTag(item)">
              <lay-icon type="layui-icon-subtraction" />
            </RippleButton>
          </lay-space>

          <RippleButton type="primary" icon="layui-icon-addition" @click="addTag"
            >添加标签</RippleButton
          >
        </lay-space>
      </lay-form-item>
    </lay-form>
  </SettingItem>

  <el-dialog v-model="visible" :title="title" append-to-body>
    <lay-form ref="formRef" :model="form">
      <lay-form-item label="标题" prop="title" required>
        <lay-input v-model="form.title" placeholder="输入标题" />
      </lay-form-item>

      <lay-form-item label="文字颜色" prop="color" required>
        <LayColorPicker v-model="form.color" />
      </lay-form-item>

      <lay-form-item label="背景颜色" prop="backgroundColor" required>
        <LayColorPicker v-model="form.backgroundColor" />
      </lay-form-item>
    </lay-form>
    <template #footer>
      <lay-button size="sm" @click="visible = false">取消</lay-button>
      <lay-button size="sm" type="primary" @click="confirm">确定</lay-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
