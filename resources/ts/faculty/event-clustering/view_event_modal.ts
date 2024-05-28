import { Department } from '#types/department'
import { EventCluster } from '#types/event_cluster'
import { Faculty } from '#types/faculty'
import { Modal } from 'bootstrap'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Swal from 'sweetalert2'
import toastr from 'toastr'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../../utils/date.js'
type ViewEventFormType = {
  id: number
  name: string
  from: Date
  to: Date
  location: string
  description: string
  departmentId: number
  department: Department
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
  departmentId: 0,
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },

  setup() {
    const form = ref<ViewEventFormType>({
      ...INITIAL_FORM,

      department: {
        id: 0,
        name: '',
        createdAt: new Date(),
      },
    })
    const currentEvent = ref<EventCluster | null>(null)
    const viewModalRef = ref<HTMLDivElement | null>(null)
    const viewModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      window.addEventListener('event:view', (event: Event) => {
        const customEvent = event as CustomEvent<EventCluster>
        const e = customEvent.detail
        form.value.id = e.id
        form.value.name = e.name
        form.value.description = e.description ?? ''
        form.value.from = e.from
        form.value.to = e.to
        form.value.facilitators = e.facilitators
        form.value.location = e.location

        currentEvent.value = e
        viewModalRef.value = document.querySelector('#viewEventModal')
        if (!viewModalRef.value) return
        viewModal.value = new Modal(viewModalRef.value)
        viewModal.value.show()
      })
    })
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
      const response = await fetch(`/admin/event-clusters/${form.value.id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        viewModal.value?.hide()
        const customEvent = new CustomEvent('calendar:refetch')
        window.dispatchEvent(customEvent)
        toastr.success('Event deleted.')
      }
    }
    return { form, toISO8601DateString, edit, initDelete }
  },
})
  .use(PrimeVue as any)
  .mount('#viewEventModal')
