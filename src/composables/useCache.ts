export const useCache = createGlobalState(() => {
  const cacheSet = ref<Set<string>>(new Set<string>())

  const cacheList = computed(() => Array.from(cacheSet.value))

  function addCache(key: string) {
    cacheSet.value.add(key)
  }

  function removeCache(key: string) {
    cacheSet.value.delete(key)
  }

  function clearCache() {
    cacheSet.value.clear()
  }

  return {
    cacheList,
    addCache,
    removeCache,
    clearCache
  }
})
