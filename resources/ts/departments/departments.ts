import { createApp, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { StatusCodes } from 'http-status-codes'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    'data-table': DataTable,
    'column': Column,
  },
  setup() {
    const form = ref({
      name: '',
    })

    const products = ref([
      {
        name: 'test',
      },
      {
        name: 'test1',
      },
    ])

    const onSubmitCreate = async () => {
      console.log('test')
      const response = await fetch('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(form.value),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      if (response.status === StatusCodes.OK) {
        alert('New Department Added')
      }
    }
    return {
      products,
      form,
      onSubmitCreate,
    }
  },
}).mount('#departmentsPage')
