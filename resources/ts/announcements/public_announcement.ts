import { Announcement } from '#types/announcement'
import { createApp, onMounted, ref } from 'vue'
import { toReadableDatetime } from '../utils/date.js'
import { Modal } from 'bootstrap'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const announcements = ref<Announcement[]>([])
    const announcementModalEl = ref<HTMLDivElement | null>(null)
    const announcementModal = ref<InstanceType<typeof Modal> | null>()
    const announcement = ref<Announcement | null>(null)
    onMounted(() => {
      fetchAnnouncements()
      if (!announcementModalEl.value) return
      announcementModal.value = new Modal(announcementModalEl.value)
    })
    const fetchAnnouncements = async () => {
      const response = await fetch('/announcements/all')
      const responseBody = await response.json()
      announcements.value =
        responseBody?.announcements?.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
        })) ?? []
    }
    const viewAnnouncement = (a: Announcement) => {
      announcement.value = { ...a }
      announcementModal.value?.show()
    }
    return {
      announcements,
      toReadableDatetime,
      announcementModalEl,
      announcement,
      viewAnnouncement,
    }
  },
}).mount('#announcements')
