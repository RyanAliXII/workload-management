import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import { EducationalAttainment } from '#types/educational_attainment'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { toReadableDatetime } from '../utils/date.js'
import Swal from 'sweetalert2'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { Modal } from 'bootstrap'
import toastr from 'toastr'
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

    const addModalRef = ref<HTMLDivElement | null>(null)
    const editModalRef = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    const editModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      fetchEducationalAttainments()
      if (!addModalRef.value || !editModalRef.value) return
      addModal.value = new Modal(addModalRef.value)
      editModal.value = new Modal(editModalRef.value)
      addModalRef.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
      })
      editModalRef.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        removeErrors()
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
    const removeErrors = () => {
      errors.value = {}
    }
    const onSubmitCreate = async () => {
      removeErrors()
      const response = await fetch('/admin/educational-attainments', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Educational attainment has been added.')
        resetForm()
        addModal.value?.hide()
        fetchEducationalAttainments()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }

    const onSubmitUpdate = async () => {
      removeErrors()
      const response = await fetch(`/admin/educational-attainments/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Educational attainment has been updated.')
        resetForm()
        editModal.value?.hide()
        fetchEducationalAttainments()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
        }
      }
    }
    const openAddModal = () => {
      addModal.value?.show()
    }

    const initEdit = (ea: EducationalAttainment) => {
      form.value.id = ea.id
      form.value.name = ea.name
      editModal.value?.show()
    }
    const initDelete = async (ea: EducationalAttainment) => {
      form.value.id = ea.id
      form.value.name = ea.name
      const result = await Swal.fire({
        title: 'Delete Educational Attainment',
        text: 'Are youre sure you want to delete this educational attainment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) return
      deleteEducationalAttainment()
    }
    const deleteEducationalAttainment = async () => {
      const response = await fetch(`/admin/educational-attainments/${form.value.id}`, {
        method: 'DELETE',
      })
      if (response.status === StatusCodes.OK) {
        toastr.success('Educational attainment deleted.')
        fetchEducationalAttainments()
      }
    }
    return {
      form,
      errors,
      onSubmitCreate,
      onSubmitUpdate,
      toReadableDatetime,
      educationalAttainments,
      initEdit,
      initDelete,
      editModalRef,
      addModalRef,
      openAddModal,
    }
  },
}).mount('#educationalAttainmentPage')
