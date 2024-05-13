import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Position } from '#types/position'
import { toReadableDatetime } from '../utils/date.js'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
  },
  setup() {
    const form = ref({
      name: '',
    })
    const errors = ref({})
    const positions = ref<Position[]>([])
    onMounted(() => {
      fetchPositions()
    })
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
    const fetchPositions = async () => {
      const response = await fetch('/admin/positions', {
        headers: { 'Content-Type': 'application/json' },
      })
      const responseBody = await response.json()
      positions.value =
        responseBody?.positions?.map((p: any) => ({
          id: p.id,
          name: p.name,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })) ?? []
    }
    return {
      form,
      errors,
      onSubmitCreate,
      positions,
      toReadableDatetime,
    }
  },
}).mount('#positionPage')
