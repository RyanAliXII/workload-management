import { Faculty } from '#types/faculty'
import { StatusCodes } from 'http-status-codes'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'
import Paginator from 'primevue/paginator'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Swal from 'sweetalert2'
import { createApp, onMounted, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
    'paginator': Paginator,
    'multi-select': MultiSelect,
  },

  setup() {
    const faculties = ref<Faculty[]>([])
    const faculty = ref<Faculty | null>(null)
    const filters = ref({
      global: {
        value: '',
        employmentStatus: '',
      },
    })
    onMounted(() => {
      faculties.value = window.viewData?.faculties ?? []
    })

    const fetchFaculties = async () => {
      const response = await fetch('/admin/faculties', {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      if (response.status === StatusCodes.OK) {
        const responseBody = await response.json()
        faculties.value = responseBody?.faculties ?? []
      }
    }
    const initDelete = async (f: Faculty) => {
      faculty.value = f
      const result = await Swal.fire({
        title: 'Delete Faculty',
        text: 'Are youre sure you want to delete this faculty?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) return
      deleteFaculty()
    }
    const deleteFaculty = async () => {
      if (!faculty.value) return
      const response = await fetch(`/admin/faculties/${faculty.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Faculty deleted.')
        fetchFaculties()
      }
    }

    return {
      faculties,
      filters,
      initDelete,
    }
  },
})
  .use(PrimeVue as any, {})
  .mount('#facultiesPage')
