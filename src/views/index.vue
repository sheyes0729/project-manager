<template>
  <h1>AppIndex</h1>
  <Button type="primary" @click="$router.push('/about')">go about</Button>
</template>

<route>
  {
    meta: {
      cache: true
    }
  }

</route>

<script lang="ts" setup>
defineOptions({
  name: 'AppIndex'
})

onMounted(async () => {
  window.electron.ipcRenderer.send('check-update')
  window.electron.ipcRenderer.on('update-message', (data) => {
    console.log(data)
  })
  const data = await window.electron.ipcRenderer.invoke('check-version')
  console.log(data)
})
</script>
<style lang="scss" scoped></style>
