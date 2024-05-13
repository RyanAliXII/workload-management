import { createApp, ref } from 'vue'

createApp({
  setup() {
    const form = ref({})
    const error = ref({})
    return {
      form,
      error,
    }
  },
}).mount('#positionPage')
