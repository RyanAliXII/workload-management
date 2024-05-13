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
    onMounted(() => {
      fetchSubjects()
      $('#addSubjectModal').on('hidden.bs.modal', () => {
        resetForm()
      })
      $('#editSubjectModal').on('hidden.bs.modal', () => {
        resetForm()
      })
    })
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }
    const fetchSubjects = async () => {
      const response = await fetch('/admin/subjects', {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
    }
    const onSubmitCreate = async () => {
      errors.value = {}
      const response = await fetch('/admin/subjects', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form.value),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        $('#addSubjectModal').modal('hide')
        toastr.success('Subject has been added.')
        resetForm()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody?.errors)
        }
      }
    }
    const onSubmitUpdate = () => {}
    return {
      form,
      onSubmitCreate,
      onSubmitUpdate,
      errors,
    }
  },
}).mount('#subjectPage')
