import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import { EducationalAttainment } from '#types/educational_attainment'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { toReadableDatetime } from '../utils/date.js'
createApp({
  components: {
    'data-table': DataTable,
    'column': Column,
  },
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
    const educationalAttainments = ref<EducationalAttainment[]>([])
    onMounted(() => {
      fetchEducationalAttainments()
      $('#addEducationalAttainmentModal').on('hidden.bs.modal', () => {
        resetForm()
      })
      $('#editEducationalAttainmentModal').on('hidden.bs.modal', () => {
        resetForm()
      })
    })
    const fetchEducationalAttainments = async () => {
      const response = await fetch('/admin/educational-attainments', {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      educationalAttainments.value =
        responseBody?.educationalAttainments?.map((ea: any) => ({
          id: ea.id,
          name: ea.name,
          createdAt: new Date(ea.createdAt),
          updatedAt: new Date(ea.updatedAt),
        })) ?? []
    }
    const errors = ref({})
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }

    const onSubmitCreate = async () => {
      errors.value = {}
      const response = await fetch('/admin/educational-attainments', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Educational attainment has been added.')
        resetForm()
        $('#addEducationalAttainmentModal').modal('hide')
        //fetchPositions()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }

    const onSubmitUpdate = async () => {
      errors.value = {}
      const response = await fetch(`/admin/positions/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Position has been updated.')
        resetForm()
        $('#editPositionModal').modal('hide')
        // fetchPositions()
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
      onSubmitUpdate,
      toReadableDatetime,
      educationalAttainments,
    }
  },
}).mount('#educationalAttainmentPage')
