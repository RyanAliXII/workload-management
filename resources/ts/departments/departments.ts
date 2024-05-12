import { createApp, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
  },
  setup() {
    const products = ref([
      {
        name: 'test',
      },
      {
        name: 'test1',
      },
    ])
    return {
      products,
    }
  },
}).mount('#departmentsPage')
