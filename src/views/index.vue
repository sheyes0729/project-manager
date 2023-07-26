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

onMounted(() => {
  console.log('App index')
})
</script>
<style lang="scss" scoped></style>
