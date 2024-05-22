import { Event as EventType } from '#types/event'
import { Faculty } from '#types/faculty'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import Swal from 'sweetalert2'
type ViewEventFormType = {
  id: number
  name: string
  from: Date
  to: Date
  location: string
  description: string
  status: 'approved' | 'unapproved'
  facilitators: Faculty[]
}
const INITIAL_FORM = {
  id: 0,
  name: '',
  from: new Date(),
  to: new Date(),
  facilitators: [],
  description: '',
  location: '',
  status: 'approved',
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },

  setup() {
    const form = ref<ViewEventFormType>({
      ...INITIAL_FORM,
      status: 'approved',
    })
    const currentEvent = ref<EventType | null>(null)

    onMounted(() => {
      window.addEventListener('event:view', (event: Event) => {
        const customEvent = event as CustomEvent<EventType>
        const e = customEvent.detail
        form.value.id = e.id
        form.value.name = e.name
        form.value.description = e.description ?? ''
        form.value.from = e.from
        form.value.to = e.to
        form.value.facilitators = e.facilitators
        form.value.location = e.location
        form.value.status = e.status
        currentEvent.value = e
        $('#viewEventModal').modal('show')
      })
    })
    const edit = () => {
      $('#viewEventModal').modal('show')
      if (!currentEvent) return
      const customEvent = new CustomEvent('event:edit', { detail: currentEvent.value })
      window.dispatchEvent(customEvent)
    }

    const initDelete = async () => {
      $('#viewEventModal').modal('hide')
      const result = await Swal.fire({
        title: 'Delete Event',
        text: 'Are youre sure you want to delete this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) {
        $('#viewEventModal').modal('show')
        return
      }
      deleteEvent()
    }
    const deleteEvent = async () => {
      const response = await fetch(`/admin/positions/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Event deleted.')
        const customEvent = new CustomEvent('calendar:refetch')
        window.dispatchEvent(customEvent)
      }
    }
    return { form, toISO8601DateString, edit, initDelete }
  },
})
  .use(PrimeVue as any)
  .mount('#viewEventModal')
