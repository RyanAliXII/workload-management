import { Task } from '#types/task'
import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import PrimeVue from 'primevue/config'
import Column from 'primevue/column'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../utils/date.js'
import Task from '#models/task'
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
      },
    })
    onMounted(() => {
      tasks.value =
        window.viewData?.tasks?.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.createdAt),
        })) ?? []
    })
    const initEdit = (task: Task) => {
      const event = new CustomEvent('task:edit', { detail: task })
      window.dispatchEvent(event)
    }
    return {
      tasks,
      toReadableDatetime,
      filters,
      initEdit,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#taskTable')
