import { Task } from '#types/task'
import { StatusCodes } from 'http-status-codes'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Swal from 'sweetalert2'
import { createApp, onMounted, ref } from 'vue'
import { toReadableDatetime } from '../utils/date.js'
import toastr from 'toastr'
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
    const initEdit = (task: Task) => {
      const event = new CustomEvent('task:edit', { detail: task })
      window.dispatchEvent(event)
    }
    const fetchTasks = async () => {
      const url = new URL(window.location.origin + '/admin/tasks')
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
    const initView = (task: Task) => {
      const event = new CustomEvent('task:view', { detail: task })
      window.dispatchEvent(event)
    }
    const initDelete = async (task: Task) => {
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
        return
      }
      deleteTask(task.id)
    }
    const openAddModal = () => {
      window.dispatchEvent(new CustomEvent('task:add'))
    }
    const deleteTask = async (id: number) => {
      const response = await fetch(`/admin/tasks/${id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Task deleted.')
        fetchTasks()
      }
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
      initDelete,
      initEdit,
      initView,
      openAddModal,
    }
  },
})
  .use(PrimeVue as any)
  .mount('#taskTable')
