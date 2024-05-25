import { Faculty } from '#types/faculty'
import { Task } from '#types/task'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-vue'
import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown'
import { createApp, onMounted, ref } from 'vue'

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
    const task = ref<Task | null>(null)
    const attachmentUrls = ref<string[]>([])
    const facultyAttachmentUrls = ref<string[]>([])
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
      window.addEventListener('task:view', (event: Event) => {
        const customEvent = event as CustomEvent<Task>
        form.value.name = customEvent.detail.name
        form.value.description = customEvent.detail.description
        form.value.facultyId = customEvent.detail.facultyId
        task.value = customEvent.detail
        $('#viewTaskModal').modal('show')
        loadAttachments(customEvent.detail.id)
      })
    })
    const isSubmitting = ref(false)
    const editorConfig = {
      readOnly: true,
      height: 500,
      toolbar: {
        items: [],

        shouldNotGroupWhenFull: true,
      },
    }
    const form = ref<AddTaskType>({
      ...INITIAL_FORM,
    })

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

    const errors = ref({})
    const loadAttachments = async (id: number) => {
      const response = await fetch(`/faculties/tasks/${id}/attachments`)
      const responseBody = await response.json()
      attachmentUrls.value = responseBody?.attachments ?? []
      facultyAttachmentUrls.value = responseBody?.facultyAttachments ?? []
    }

    return {
      form,
      errors,

      fileInput,
      editor,
      editorConfig,
      task,
      handleFileAttachments,
      isSubmitting,
      attachmentUrls,
      facultyAttachmentUrls,
    }
  },
})
  .use(PrimeVue as any)
  .use(CKEditor as any)
  .mount('#viewTaskModal')
