import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import { LessonPlan } from '#types/lesson_plan'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../utils/date.js'
import Department from '#models/department'

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
    const departments = ref<Department[]>([])
    const fetchLessonPlans = async () => {
      const response = await fetch('/admin/lesson-plans', {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      const responseBody = await response.json()
      lessonPlans.value =
        responseBody?.lessonPlans?.map((l: any) => ({ ...l, createdAt: new Date(l.createdAt) })) ??
        []
      departments.value = responseBody?.departments ?? []
    }
    const fetchLessonPlansByDepartmentId = async (event: Event) => {
      const select = event.target as HTMLSelectElement
      if (select.value === '') {
        fetchLessonPlans()
        return
      }
      console.log(select.value)
      const response = await fetch(`/admin/lesson-plans?departmentId=${select.value}`, {
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      const responseBody = await response.json()
      lessonPlans.value =
        responseBody?.lessonPlans?.map((l: any) => ({ ...l, createdAt: new Date(l.createdAt) })) ??
        []
      departments.value = responseBody?.departments ?? []
    }

    return { lessonPlans, toReadableDatetime, departments, fetchLessonPlansByDepartmentId }
  },
})
  .use(PrimeVue as any)
  .mount('#lessonPlanPage')
