import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Position } from '#types/position'
import { toReadableDatetime } from '../utils/date.js'
import Swal from 'sweetalert2'

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
      id: 0,
      name: '',
    })
    const errors = ref({})
    const positions = ref<Position[]>([])
    const resetForm = () => {
      form.value = {
        id: 0,
        name: '',
      }
    }
    onMounted(() => {
      fetchPositions()
      $('#addPositionModal').on('hidden.bs.modal', function () {
        resetForm()
      })
      $('#editPositionModal').on('hidden.bs.modal', function () {
        resetForm()
      })
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
        resetForm()
        $('#addPositionModal').modal('hide')
        fetchPositions()
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
        fetchPositions()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const initEdit = (position: Position) => {
      form.value = position
      $('#editPositionModal').modal('show')
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
    const initDelete = async (position: Position) => {
      form.value = position
      const result = await Swal.fire({
        title: 'Delete Position',
        text: 'Are youre sure you want to delete this position?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) return
      deletePosition()
    }
    const deletePosition = async () => {
      const response = await fetch(`/admin/positions/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Department deleted.')
        fetchPositions()
      }
    }
    return {
      form,
      errors,
      onSubmitCreate,
      onSubmitUpdate,
      positions,
      initEdit,
      initDelete,
      toReadableDatetime,
    }
  },
}).mount('#positionPage')
