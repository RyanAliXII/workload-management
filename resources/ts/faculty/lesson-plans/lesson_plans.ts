import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import { LessonPlan } from '#types/lesson_plan'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../../utils/date.js'
import toastr from 'toastr'
import { StatusCodes } from 'http-status-codes'
import Swal from 'sweetalert2'
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
    const initDelete = async (plan: LessonPlan) => {
      const result = await Swal.fire({
        title: 'Delete Lesson Plan',
        text: 'Are youre sure you want to delete this lesson plan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) {
        return
      }
      deletePlan(plan.id)
    }

    const deletePlan = async (id: number) => {
      const response = await fetch(`/faculties/lesson-plans/${id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Lesson plan deleted.')
        fetchLessonPlans()
      }
    }

    return { lessonPlans, toReadableDatetime, initDelete }
  },
})
  .use(PrimeVue as any)
  .mount('#lessonPlanPage')
