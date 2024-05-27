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
import { Department } from '#types/department'
type AddEventFormType = {
  name: string
  from: Date
  to: Date
  location: string
  description: string
  status: 'approved' | 'unapproved'
  facilitators: number[]
}
const INITIAL_FORM = {
  name: '',
  from: new Date(),
  to: new Date(),
  facilitators: [],
  description: '',
  location: '',
  status: 'approved',
}
createApp({
  components: {
    'multi-select': MultiSelect,
  },
  compilerOptions: {
    delimiters: ['${', '}'],
  },

  setup() {
    const form = ref<AddEventFormType>({
      ...INITIAL_FORM,
      status: 'approved',
    })

    const activeFaculty = ref<Faculty[]>([])
    const facilitators = computed<OptionWithMeta<number, Faculty>[]>(() =>
      activeFaculty.value.map((f) => ({
        value: f.id,
        label: `${f.givenName} ${f.middleName} ${f.surname}`,
        meta: f,
      }))
    )
    const addModalRef = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
      addModalRef.value = document.querySelector('#addEventModal')

      if (!addModalRef.value) return
      addModal.value = new Modal(addModalRef.value)
      addModalRef.value?.addEventListener('hidden.bs.modal', () => {
        clearErrors()
        resetForm()
      })
      window.addEventListener('event:add', () => {
        addModal.value?.show()
      })
    })
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
      form.value = { ...INITIAL_FORM, status: 'approved' }
    }

    const onSubmitCreate = async () => {
      clearErrors()

      const body = {
        name: form.value.name,
        from: toISO8601DateString(form.value.from),
        to: toISO8601DateString(form.value.to),
        facilitatorIds: form.value.facilitators,
        description: form.value.description,
        location: form.value.location,
        status: form.value.status,
      }
      const response = await fetch('/admin/events', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        addModal.value?.hide()
        toastr.success('Event created.')
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
      addModalRef,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#addEventModal')
