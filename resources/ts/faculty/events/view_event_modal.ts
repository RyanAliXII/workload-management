import { Event as EventType } from '#types/event'
import { Faculty } from '#types/faculty'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { computed, createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../../utils/date.js'
import Swal from 'sweetalert2'
import toastr from 'toastr'
import { Modal } from 'bootstrap'
type ViewEventFormType = {
  id: number
  name: string
  from: Date
  to: Date
  location: string
  description: string
  status: 'approved' | 'unapproved'
  facilitators: Faculty[]
  isPublic: boolean
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
  isPublic: false,
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
    const viewModalRef = ref<HTMLDivElement | null>(null)
    const viewModal = ref<InstanceType<typeof Modal> | null>()
    onMounted(() => {
      viewModalRef.value = document.querySelector('#viewEventModal')
      if (!viewModalRef.value) return
      viewModal.value = new Modal(viewModalRef.value)
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
        form.value.isPublic = e.isPublic
        currentEvent.value = e
        viewModal.value?.show()
      })
    })
    const isEditable = computed(
      () => currentEvent.value?.createdById === window.viewData?.authUserId
    )
    const edit = () => {
      viewModal.value?.hide()
      if (!currentEvent) return
      const customEvent = new CustomEvent('event:edit', { detail: currentEvent.value })
      window.dispatchEvent(customEvent)
    }

    const initDelete = async () => {
      viewModal.value?.hide()
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
        viewModal.value?.show()
        return
      }
      deleteEvent()
    }
    const deleteEvent = async () => {
      const response = await fetch(`/admin/events/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        viewModal.value?.hide()
        const customEvent = new CustomEvent('calendar:refetch')
        window.dispatchEvent(customEvent)
        toastr.success('Event deleted.')
      }
    }
    return { form, toISO8601DateString, edit, initDelete, isEditable, currentEvent }
  },
})
  .use(PrimeVue as any)
  .mount('#viewEventModal')
