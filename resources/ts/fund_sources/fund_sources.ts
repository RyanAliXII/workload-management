import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'

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
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }
    const removeErrors = () => {
      errors.value = {}
    }
    onMounted(() => {
      $('#addFundSourceModal').on('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
      })
      $('#editFundSourceModal').on('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
      })
    })
    const onSubmitCreate = async () => {
      const response = await fetch('/admin/fund-sources', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Fund source added.')
        resetForm()
        $('#addFundSourceModal').modal('hide')
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const onSubmitUpdate = () => {}

    return {
      form,
      errors,
      onSubmitCreate,
      onSubmitUpdate,
    }
  },
}).mount('#fundSourcePage')
