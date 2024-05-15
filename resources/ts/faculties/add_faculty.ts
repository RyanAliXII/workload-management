import { createApp, ref } from 'vue'

createApp({
  setup() {
    const form = ref({})
    const errors = ref({})

    return {
      form,
      errors,
    }
  },
}).mount('#addFacultyPage')
