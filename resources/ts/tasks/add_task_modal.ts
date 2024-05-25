import { Faculty } from '#types/faculty'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { StatusCodes } from 'http-status-codes'
import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown'
import { computed, createApp, onMounted, ref } from 'vue'
import { toStructuredErrors } from '../utils/form.js'
import { Modal } from 'bootstrap'
import toastr from 'toastr'
const INITIAL_FORM = {
  name: '',
  fileAttachments: [],
  description: '',
  facultyId: 0,
}
type AddTaskType = {
  name: string
  fileAttachments: string[]
  description: string
  facultyId: number
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  components: {
    dropdown: Dropdown,
  },
  setup() {
    const activeFaculty = ref<Faculty[]>([])
    const editor = ref(ClassicEditor)
    const attachments = ref<File[]>([])
    const addModalRef = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
      addModalRef.value = document.querySelector('#addTaskModal')
      if (!addModalRef.value) return
      addModal.value = new Modal(addModalRef.value)
      addModalRef.value?.addEventListener('hidden.bs.modal', () => {
        removeErrors()
        resetForm()
      })
      window.addEventListener('task:add', () => {
        addModal.value?.show()
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
    const form = ref<AddTaskType>({
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

      return fetch('/admin/tasks/attachments', {
        method: 'POST',
        body: formData,
      })
    }
    const facultyOptions = computed(
      () =>
        activeFaculty?.value?.map((f) => ({
          value: f.id,
          label: `${f.givenName} ${f.middleName} ${f.surname}`,
        })) ?? []
    )
    const errors = ref({})

    const onSubmitCreate = async () => {
      isSubmitting.value = true
      try {
        removeErrors()
        const response = await fetch('/admin/tasks', {
          method: 'POST',
          body: JSON.stringify(form.value),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        const responseBody = await response.json()
        if (response.status === StatusCodes.OK) {
          await uploadFileAttachments(responseBody?.task?.id)
          toastr.success('Task has been added.')
          resetForm()
          addModal.value?.hide()
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
      facultyOptions,
      fileInput,
      editor,
      editorConfig,
      handleFileAttachments,
      isSubmitting,
    }
  },
})
  .use(PrimeVue as any)
  .use(CKEditor as any)
  .mount('#addTaskModal')
