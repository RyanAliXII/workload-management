import { Task } from '#types/task'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown'
import { createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../../utils/form.js'

const INITIAL_FORM = {
  remarks: '',
  fileAttachments: [],
}
type TaskCompletionType = {
  remarks: string
  fileAttachments: string[]
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    dropdown: Dropdown,
  },
  setup() {
    const editor = ref(ClassicEditor)
    const attachments = ref<File[]>([])
    const task = ref<Task | null>(null)

    onMounted(() => {
      window.addEventListener('task:completion', (event: Event) => {
        const customEvent = event as CustomEvent<Task>
        task.value = customEvent.detail
        $('#completionModal').modal('show')
      })
    })
    const isSubmitting = ref(false)
    const editorConfig = {
      height: 500,
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'fontfamily',
          'fontsize',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'strikethrough',
          'subscript',
          'superscript',
          'code',
          '|',
          'link',
          'blockQuote',
          'codeBlock',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'outdent',
          'indent',
        ],

        shouldNotGroupWhenFull: true,
      },
    }
    const form = ref<TaskCompletionType>({
      ...INITIAL_FORM,
    })
    const removeErrors = () => {
      errors.value = {}
    }
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
      attachments.value = []
      if (fileInput.value) {
        fileInput.value = null
      }
    }
    const fileInput = ref<HTMLInputElement | null>(null)
    const handleFileAttachments = (event: Event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (!files) return
      form.value.fileAttachments = []
      attachments.value = []
      for (const file of files) {
        const url = URL.createObjectURL(file)
        form.value.fileAttachments.push(url.toString())
        attachments.value.push(file)
      }
    }
    const uploadFileAttachments = async (taskId: number) => {
      if (attachments.value.length === 0 || !taskId) return
      const formData = new FormData()
      formData.append('taskId', taskId.toString())
      attachments.value.forEach((a) => {
        formData.append('attachments[]', a)
      })

      return fetch('/faculties/tasks/attachments', {
        method: 'POST',
        body: formData,
      })
    }

    const errors = ref({})

    const onSubmitCreate = async () => {
      isSubmitting.value = true
      try {
        removeErrors()
        const response = await fetch(`/faculties/tasks/${task.value?.id}/completion`, {
          method: 'PATCH',
          body: JSON.stringify(form.value),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        const responseBody = await response.json()
        if (response.status === StatusCodes.OK) {
          await uploadFileAttachments(responseBody?.task?.id)

          toastr.success('Task has been updated.')
          resetForm()
          $('#completionModal').modal('hide')
          const customEvent = new CustomEvent('task:refetch')
          window.dispatchEvent(customEvent)
        }
        if (response.status === StatusCodes.BAD_REQUEST) {
          if (responseBody?.errors) {
            errors.value = toStructuredErrors(responseBody.errors)
          }
        }
      } catch (error) {
        console.log(error)
        toastr.error('Unknown error occured.')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      onSubmitCreate,
      fileInput,
      editor,
      editorConfig,
      task,
      handleFileAttachments,
      isSubmitting,
    }
  },
})
  .use(PrimeVue as any)
  .use(CKEditor as any)
  .mount('#completionModal')
