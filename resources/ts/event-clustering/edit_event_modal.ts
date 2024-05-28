import { Event as EventType } from '#types/event'
import { Faculty } from '#types/faculty'
import { OptionWithMeta } from '#types/option'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import MultiSelect from 'primevue/multiselect'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { computed, createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import { Modal } from 'bootstrap'
import toastr from 'toastr'
import { EventCluster } from '#types/event_cluster'
import { Department } from '#types/department'
type EditEventFormType = {
  id: number
  name: string
  from: Date
  to: Date
  location: string
  description: string
  departmentId: number
  facilitators: number[]
}
const INITIAL_FORM = {
  id: 0,
  name: '',
  from: new Date(),
  to: new Date(),
  facilitators: [],
  description: '',
  location: '',
  departmentId: 0,
}
createApp({
  components: {
    'multi-select': MultiSelect,
  },
  compilerOptions: {
    delimiters: ['${', '}'],
  },

  setup() {
    const form = ref<EditEventFormType>({
      ...INITIAL_FORM,
    })

    const activeFaculty = ref<Faculty[]>([])
    const facilitators = computed<OptionWithMeta<number, Faculty>[]>(() =>
      activeFaculty.value.map((f) => ({
        value: f.id,
        label: `${f.givenName} ${f.middleName} ${f.surname}`,
        meta: f,
      }))
    )
    const editModalRef = ref<HTMLDivElement | null>(null)
    const editModal = ref<InstanceType<typeof Modal> | null>(null)
    const departments = ref<Department[]>([])
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
      departments.value = window.viewData?.departments ?? []
      editModalRef.value = document.querySelector('#editEventModal')
      if (!editModalRef.value) return
      editModal.value = new Modal(editModalRef.value)
      editModalRef.value.addEventListener('hidden.bs.modal', () => {
        clearErrors()
        resetForm()
      })

      window.addEventListener('event:edit', (event: Event) => {
        const customEvent = event as CustomEvent<EventCluster>
        const e = customEvent.detail
        form.value.id = e.id
        form.value.name = e.name
        form.value.description = e.description ?? ''
        form.value.from = e.from
        form.value.to = e.to
        form.value.location = e.location
        form.value.departmentId = e.departmentId
        form.value.facilitators = e.facilitators?.map((f) => f.id)
        editModal.value?.show()
      })
    })
    const fetchFacultyByDepartment = async (id: number) => {
      const response = await fetch(`/admin/event-clusters/departments/${id}/faculty`)
      const responseBody = await response.json()
      activeFaculty.value = responseBody?.faculty ?? []
    }
    const onDepartmentSelect = (event: Event) => {
      const target = event.target as HTMLSelectElement
      const value = Number.parseInt(target.value)
      form.value.facilitators = []
      fetchFacultyByDepartment(value)
    }
    const handleDateInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value
      const name = target.name as 'from' | 'to'
      form.value[name] = new Date(value)
    }
    const errors = ref({})
    const clearErrors = () => {
      errors.value = {}
    }
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
    }

    const onSubmitCreate = async () => {
      clearErrors()

      const body = {
        id: form.value.id,
        name: form.value.name,
        from: toISO8601DateString(form.value.from),
        to: toISO8601DateString(form.value.to),
        facilitatorIds: form.value.facilitators,
        description: form.value.description,
        location: form.value.location,
        departmentId: form.value.departmentId,
      }
      const response = await fetch(`/admin/event-clusters/${form.value.id}`, {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        editModal.value?.hide()
        toastr.success('Event updated.')
        const event = new CustomEvent('calendar:refetch', {})
        window.dispatchEvent(event)
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = responseBody?.errors
        }
      }
      if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        toastr.error('Unknown error occured.')
      }
    }

    return {
      form,
      onSubmitCreate,
      errors,
      facilitators,
      toISO8601DateString,
      handleDateInput,
      departments,
      onDepartmentSelect,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#editEventModal')
