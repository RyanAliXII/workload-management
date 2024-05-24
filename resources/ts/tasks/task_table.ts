import { Task } from '#types/task'
import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import PrimeVue from 'primevue/config'
import Column from 'primevue/column'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../utils/date.js'
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
      tasks.value = window.viewData?.tasks ?? []
    })
    return {
      tasks,
      toReadableDatetime,
      filters,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#taskTable')
