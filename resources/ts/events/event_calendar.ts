import { createApp, onMounted, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarOptions, EventInput, EventSourceFunc } from '@fullcalendar/core'
import { toISO8601DateString } from '../utils/date.js'
import { Event, EventJSON } from '#types/event'

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
          title: `${event.name} - ${event.status}`,
          end: event.to + ' 23:59:00',
          extendedProps: {
            event: { ...event, from: new Date(event.from), to: new Date(event.to) } as Event,
          },
        })
      })
      success(events)
    }
    const calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: fetchEvents,
    }
    const reloadCalendar = () => {
      fullCalendar.value?.getApi().refetchEvents()
    }
    onMounted(() => {
      window.addEventListener('calendar:refetch', () => {
        reloadCalendar()
      })
    })
    return {
      calendarOptions,
      fullCalendar,
    }
  },
}).mount('#eventPage')
