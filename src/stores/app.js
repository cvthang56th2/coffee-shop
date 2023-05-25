import { defineStore } from "pinia"
import { ref } from "vue"

export const useAppStore = defineStore('app', () => {
  const settings = ref({})
  function setSettings(data) {
    settings.value = data || {}
  }

  return { settings, setSettings }
})