import { EventJSON } from '#types/event'
import { CalendarOptions, EventInput, EventSourceFunc } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/vue3'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'

createApp({
  components: {
    'full-calendar': FullCalendar,
  },
  setup() {
    const fullCalendar = ref<InstanceType<typeof FullCalendar> | null>(null)
    const eventUrl = new URL(window.location.origin + '/admin/events')
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
          title: `${event.name} - ${event.status === 'unapproved' ? 'Pending' : 'Approved'}`,
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
      events: fetchEvents,
      eventClick: (e) => {
        const customEvent = new CustomEvent('event:view', { detail: e.event.extendedProps?.event })
        window.dispatchEvent(customEvent)
      },
    }
    const reloadCalendar = () => {
      fullCalendar.value?.getApi().refetchEvents()
    }
    onMounted(() => {
      window.addEventListener('calendar:refetch', () => {
        reloadCalendar()
      })
    })
    const openAddModal = () => {
      window.dispatchEvent(new CustomEvent('event:add'))
    }
    return {
      calendarOptions,
      fullCalendar,
      openAddModal,
    }
  },
}).mount('#eventPage')
