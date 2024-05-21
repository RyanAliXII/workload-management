import { createApp } from 'vue'
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
    return {}
  },
}).mount('#facultiesPage')
