import { createApp, ref } from 'vue'

createApp({
  setup() {
    const INITIAL_FORM = {
      id: 0,
      name: '',
    }
    const form = ref({ ...INITIAL_FORM })
    const errors = ref({})
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }
    const onSubmitCreate = () => {}
    const onSubmitUpdate = () => {}
    return {
      form,
      onSubmitCreate,
      onSubmitUpdate,
      errors,
    }
  },
}).mount('#subjectPage')
