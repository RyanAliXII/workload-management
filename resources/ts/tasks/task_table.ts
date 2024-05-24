import { Task } from '#types/task'
import { createApp, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import PrimeVue from 'primevue/config'
import Column from 'primevue/column'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { toReadableDatetime } from '../utils/date.js'
import Swal from 'sweetalert2'
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
    const initDelete = async (task: Task) => {
      $('#viewEventModal').modal('hide')
      const result = await Swal.fire({
        title: 'Delete Task',
        text: 'Are youre sure you want to delete this task?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#cc3939',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: `Don't delete`,
        cancelButtonColor: '#858181',
      })
      if (!result.isConfirmed) {
        $('#viewEventModal').modal('show')
        return
      }
      deleteTask(task.id)
    }
    const deleteTask = async (id: number) => {
      const response = await fetch(`/admin/tasks/${id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Task deleted.')
      }
    }
    return {
      tasks,
      toReadableDatetime,
      filters,
      initDelete,
      initEdit,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#taskTable')
