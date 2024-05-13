import { StatusCodes } from 'http-status-codes'
import { createApp, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const form = ref({
      name: '',
    })
    const errors = ref({})
    const onSubmitCreate = async () => {
      errors.value = {}
      const response = await fetch('/admin/positions', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Position has been added.')
        form.value.name = ''
        $('#addPositionModal').modal('hide')
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    return {
      form,
      errors,
      onSubmitCreate,
    }
  },
}).mount('#positionPage')
