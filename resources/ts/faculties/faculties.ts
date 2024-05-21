import { createApp, onMounted, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Faculty } from '#types/faculty'
import PrimeVue from 'primevue/config'
import Paginator from 'primevue/paginator'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import MultiSelect from 'primevue/multiselect'
import { filter } from 'lodash'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
    'paginator': Paginator,
    'multi-select': MultiSelect,
  },

  setup() {
    const faculties = ref<Faculty[]>([])
    const filters = ref({
      global: {
        value: '',
        employmentStatus: '',
      },
    })
    watch(filters, (oldFil, newFil) => {
      console.log(oldFil)
      console.log(newFil)
    })
    onMounted(() => {
      faculties.value = window.viewData?.faculties ?? []
    })
    return {
      faculties,
      filters,
    }
  },
})
  .use(PrimeVue as any, {})
  .mount('#facultiesPage')
