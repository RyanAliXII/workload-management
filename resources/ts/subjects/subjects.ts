import { StatusCodes } from 'http-status-codes'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import { Subject } from '#types/subjects'
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
    const form = ref({ ...INITIAL_FORM })
    const errors = ref({})
    const subjects = ref<Subject[]>([])
    const addModalRef = ref<HTMLDivElement | null>(null)
    const editModalRef = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    const editModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      fetchSubjects()
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
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }
    const removeErrors = () => {
      errors.value = {}
    }
    const fetchSubjects = async () => {
      const response = await fetch('/admin/subjects', {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      subjects.value =
        responseBody?.subjects?.map((s: any) => ({
          id: s.id,
          name: s.name,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        })) ?? []
    }
    const onSubmitCreate = async () => {
      removeErrors()
      const response = await fetch('/admin/subjects', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form.value),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        fetchSubjects()
        addModal.value?.hide()
        toastr.success('Subject has been added.')
        resetForm()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody?.errors)
        }
      }
    }
    const initEdit = (subject: Subject) => {
      form.value.id = subject.id
      form.value.name = subject.name
      editModal.value?.show()
    }
    const onSubmitUpdate = async () => {
      removeErrors()
      const response = await fetch(`/admin/subjects/${form.value.id}`, {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form.value),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        fetchSubjects()
        editModal.value?.hide()
        toastr.success('Subject has been updated.')
        resetForm()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody?.errors)
        }
      }
    }
    const initDelete = async (subject: Subject) => {
      form.value.id = subject.id
      form.value.name = subject.name
      const result = await Swal.fire({
        title: 'Delete Subject',
        text: 'Are youre sure you want to delete this subject?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) return
      deleteSubject()
    }
    const deleteSubject = async () => {
      const response = await fetch(`/admin/subjects/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Subject deleted.')
        fetchSubjects()
      }
    }
    const openAddModal = () => {
      addModal.value?.show()
    }
    return {
      form,
      onSubmitCreate,
      onSubmitUpdate,
      errors,
      subjects,
      initEdit,
      initDelete,
      toReadableDatetime,
      openAddModal,
      addModalRef,
      editModalRef,
    }
  },
}).mount('#subjectPage')
