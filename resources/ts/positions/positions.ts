import { createApp, ref } from 'vue'

createApp({
  setup() {
    const form = ref({})
    const error = ref({})
    console.log('Mounted')
    return {
      form,
      error,
    }
  },
}).mount('#positionPage')
