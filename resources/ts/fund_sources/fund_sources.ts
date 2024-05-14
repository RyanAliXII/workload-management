import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import FundSource from '#models/fund_source'
import { toReadableDatetime } from '../utils/date.js'
import Swal from 'sweetalert2'
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
      fetchFundSources()
    })
    const fundSources = ref<FundSource[]>([])
    const fetchFundSources = async () => {
      const response = await fetch('/admin/fund-sources', {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      fundSources.value =
        responseBody?.fundSources?.map((fs: any) => ({
          id: fs.id,
          name: fs.name,
          createdAt: new Date(fs.createdAt),
          updatedAt: new Date(fs.updatedAt),
        })) ?? []
    }
    const onSubmitCreate = async () => {
      removeErrors()
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
        fetchFundSources()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const onSubmitUpdate = async () => {
      removeErrors()
      const response = await fetch(`/admin/fund-sources/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Fund source updated.')
        resetForm()
        $('#editFundSourceModal').modal('hide')
        fetchFundSources()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const initEdit = (source: FundSource) => {
      form.value.id = source.id
      form.value.name = source.name
      $('#editFundSourceModal').modal('show')
    }
    const initDelete = async (fundSource: FundSource) => {
      form.value.id = fundSource.id
      form.value.name = fundSource.name
      const result = await Swal.fire({
        title: 'Delete Fund Source',
        text: 'Are youre sure you want to delete this fund source?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) {
        resetForm()
        return
      }
      deleteFundSource()
    }
    const deleteFundSource = async () => {
      const response = await fetch(`/admin/fund-sources/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Fund source deleted.')
        fetchFundSources()
      }
    }

    return {
      form,
      errors,
      onSubmitCreate,
      onSubmitUpdate,
      initEdit,
      fundSources,
      toReadableDatetime,
      initDelete,
    }
  },
}).mount('#fundSourcePage')
