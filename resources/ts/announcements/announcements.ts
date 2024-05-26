import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Modal } from 'bootstrap'
import { createApp, onMounted, ref } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
createApp({
  setup() {
    const addModalEl = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    const editor = ref(ClassicEditor)
    const isSubmitting = ref(false)
    const form = ref({
      title: '',
      content: '',
    })
    onMounted(() => {
      if (!addModalEl.value) return
      addModal.value = new Modal(addModalEl.value)
    })
    const openAddModal = () => {
      addModal.value?.show()
    }
    const onSubmitCreate = () => {}
    const errors = ref({})
    const resetForm = () => {
      form.value = {
        title: '',
        content: '',
      }
    }
    const clearErrors = () => {
      errors.value = {}
    }
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
    return {
      addModalEl,
      openAddModal,
      form,
      onSubmitCreate,
      editor,
      editorConfig,
      errors,
      isSubmitting,
    }
  },
})
  .use(CKEditor as any)
  .mount('#announcementPage')
