import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../utils/form.js'
import toastr from 'toastr'
import Department from '#models/department'
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

    const products = ref([
      {
        name: 'test',
      },
      {
        name: 'test1',
      },
    ])
    const departments = ref<Department[]>([])
    const fetchDepartments = async () => {
      const response = await fetch('/admin/departments', {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      departments.value = responseBody?.departments?.map((d: any) => ({
        id: d.id,
        name: d.name,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      }))
    }
    onMounted(() => {
      fetchDepartments()
    })
    const onSubmitCreate = async () => {
      errors.value = {}
      const response = await fetch('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('New department created.')
        form.value = { name: '' }
        $('#newDepartmentModal').modal('hide')
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    return {
      products,
      form,
      errors,
      onSubmitCreate,
      toReadableDatetime,
      departments,
    }
  },
}).mount('#departmentsPage')
