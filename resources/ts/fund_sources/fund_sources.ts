import { createApp, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const INITIAL_FORM = {
      id: 0,
      name: '',
    }
    const form = ref({ ...INITIAL_FORM })
    const errors = ref({})
    const onSubmitCreate = () => {}
    const onSubmitUpdate = () => {}

    return {
      form,
      errors,
      onSubmitCreate,
      onSubmitUpdate,
    }
  },
}).mount('#fundSourcePage')
