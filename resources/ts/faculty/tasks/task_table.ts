import { Task } from '#types/task'

import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import 'primevue/resources/themes/md-light-indigo/theme.css'

import { createApp, onMounted, ref } from 'vue'
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
    const tasks = ref<Task[]>([])
    const filters = ref({
      global: {
        value: '',
        status: '',
      },
    })
    onMounted(() => {
      tasks.value =
        window.viewData?.tasks?.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.createdAt),
        })) ?? []
      window.addEventListener('task:refetch', () => {
        fetchTasks()
      })
    })
    const initView = (task: Task) => {
      const event = new CustomEvent('task:view', { detail: task })
      window.dispatchEvent(event)
    }
    const initCompletion = (task: Task) => {
      const event = new CustomEvent('task:completion', { detail: task })
      window.dispatchEvent(event)
    }
    const fetchTasks = async () => {
      const url = new URL(window.location.origin + '/faculties/tasks')
      url.searchParams.set('status', filters.value.global.status)
      const response = await fetch(url.toString(), {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      tasks.value =
        responseBody?.tasks?.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.createdAt),
        })) ?? []
    }

    const handleStatusChange = (event: Event) => {
      const target = event.target as HTMLSelectElement
      filters.value.global.status = target.value
      fetchTasks()
    }
    return {
      tasks,
      toReadableDatetime,
      filters,
      handleStatusChange,
      initView,
      initCompletion,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#taskTable')
