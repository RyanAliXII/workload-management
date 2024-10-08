import Department from '#models/department'
import { Modal } from 'bootstrap'
import { StatusCodes } from 'http-status-codes'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Swal from 'sweetalert2'
import toastr from 'toastr'
import { createApp, onMounted, ref } from 'vue'
import { toReadableDatetime } from '../utils/date.js'
import { toStructuredErrors } from '../utils/form.js'
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
    const products = ref([
      {
        name: 'test',
      },
      {
        name: 'test1',
      },
    ])
    const resetForm = () => {
      form.value = { name: '', id: 0 }
    }
    const removeErrors = () => {
      errors.value = {}
    }
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
    const addModalEl = ref<HTMLDivElement | null>(null)
    const editModalEl = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    const editModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      fetchDepartments()
      if (!addModalEl.value || !editModalEl.value) return
      addModal.value = new Modal(addModalEl.value)
      editModal.value = new Modal(editModalEl.value)
      addModalEl.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
      })
      editModalEl.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
      })
    })
    const openAddModal = () => {
      addModal.value?.show()
    }
    const onSubmitCreate = async () => {
      removeErrors()
      const response = await fetch('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('New department created.')
        resetForm()
        addModal.value?.hide()
        fetchDepartments()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const onSubmitUpdate = async () => {
      removeErrors()
      const response = await fetch(`/admin/departments/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Department updated.')
        resetForm()
        editModal.value?.hide()
        fetchDepartments()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const initEdit = (department: Department) => {
      form.value = {
        id: department.id,
        name: department.name,
      }
      editModal.value?.show()
    }
    const initDelete = async (department: Department) => {
      form.value = {
        id: department.id,
        name: department.name,
      }
      const result = await Swal.fire({
        title: 'Delete Department',
        text: 'Are youre sure you want to delete this department?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) return
      deleteDepartment()
    }
    const deleteDepartment = async () => {
      const response = await fetch(`/admin/departments/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Department deleted.')
        fetchDepartments()
      }
    }
    return {
      products,
      form,
      errors,
      onSubmitCreate,
      toReadableDatetime,
      initEdit,
      onSubmitUpdate,
      departments,
      initDelete,
      addModalEl,
      editModalEl,
      openAddModal,
    }
  },
}).mount('#departmentsPage')
