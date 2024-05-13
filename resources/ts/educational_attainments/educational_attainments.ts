import { createApp, onMounted, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const INITIAL_FORM = {
      id: 0,
      name: '',
    }
    const form = ref({
      ...INITIAL_FORM,
    })
    onMounted(() => {
      $('#addEducationalAttainmentModal').on('hidden.bs.modal', () => {
        resetForm()
      })
      $('#editEducationalAttainmentModal').on('hidden.bs.modal', () => {
        resetForm()
      })
    })
    const errors = ref({})
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }

    const onSubmitCreate = () => {}
    const onSubmitUpdate = () => {}
    return { form, errors, onSubmitCreate, onSubmitUpdate }
  },
}).mount('#educationalAttainmentPage')
