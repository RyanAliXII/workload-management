import { EventJSON } from '#types/event'
import { CalendarOptions, EventInput, EventSourceFunc } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/vue3'
import { createApp, onMounted, ref } from 'vue'
import { Event as EventType } from '#types/event'
import { Modal } from 'bootstrap'
import { toISO8601DateString } from '../utils/date.js'
createApp({
  components: {
    'full-calendar': FullCalendar,
  },
  setup() {
    const fullCalendar = ref<InstanceType<typeof FullCalendar> | null>(null)
    const eventUrl = new URL(window.location.origin + '/events/public')

    type ViewEventType = Omit<EventType, 'facilitators' | 'isPublic' | 'status'>
    const currentEvent = ref<ViewEventType>({
      id: 0,
      from: new Date(),
      to: new Date(),
      location: '',
      name: '',
      description: '',
    })
    const viewModalRef = ref<HTMLDivElement | null>()
    const viewModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      if (viewModalRef.value) {
        viewModal.value = new Modal(viewModalRef.value)
      }
    })
    const fetchEvents: EventSourceFunc = async (info, success) => {
      const start = toISO8601DateString(info.start)
      const end = toISO8601DateString(info.end)
      eventUrl.searchParams.set('from', start)
      eventUrl.searchParams.set('to', end)
      const response = await fetch(eventUrl.toString(), {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const data = await response.json()

      const events: EventInput[] = []
      data?.events?.forEach((event: EventJSON) => {
        events.push({
          start: event.from,
          title: `${event.name}`,
          end: event.to + ' 23:59:00',
          className:
            event.status === 'approved' ? 'calendar-event' : 'event-bg-unapproved calendar-event',
          extendedProps: {
            event: { ...event, from: new Date(event.from), to: new Date(event.to) },
          },
        })
      })
      success(events)
    }
    const calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      displayEventTime: false,
      events: fetchEvents,
      eventClick: (data) => {
        currentEvent.value = data.event.extendedProps.event
        viewModal.value?.show()
      },
    }

    return {
      calendarOptions,
      fullCalendar,
      viewModalRef,
      currentEvent,
      toISO8601DateString,
    }
  },
}).mount('#eventPage')
