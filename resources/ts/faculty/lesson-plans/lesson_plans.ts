import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import { LessonPlan } from '#types/lesson_plan'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../../utils/date.js'
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
  },
  setup() {
    onMounted(() => {
      fetchLessonPlans()
    })
    const lessonPlans = ref<LessonPlan[]>([])
    const fetchLessonPlans = async () => {
      const response = await fetch('/faculties/lesson-plans', {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      const responseBody = await response.json()
      lessonPlans.value =
        responseBody?.lessonPlans?.map((l: any) => ({ ...l, createdAt: new Date(l.createdAt) })) ??
        []
    }

    return { lessonPlans, toReadableDatetime }
  },
})
  .use(PrimeVue as any)
  .mount('#lessonPlanPage')
