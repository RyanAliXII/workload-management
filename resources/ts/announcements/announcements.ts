import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Modal } from 'bootstrap'
import { createApp, onMounted, ref } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import toastr from 'toastr'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../utils/form.js'
import { toReadableDatetime } from '../utils/date.js'
import { Announcement } from '#types/announcement'
import Swal from 'sweetalert2'
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const addModalEl = ref<HTMLDivElement | null>(null)
    const editModalEl = ref<HTMLDivElement | null>(null)
    const addModal = ref<InstanceType<typeof Modal> | null>(null)
    const editModal = ref<InstanceType<typeof Modal> | null>(null)
    const editor = ref(ClassicEditor)
    const thumbnail = ref<File | null>(null)
    const isSubmitting = ref(false)
    const form = ref({
      id: 0,
      title: '',
      content: '',
    })
    const addForm = ref<HTMLFormElement>()
    const editForm = ref<HTMLFormElement>()
    const handleImageAttach = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files || input.files.length === 0) return
      thumbnail.value = input.files[0]
    }
    const uploadImage = async (file: File) => {
      const formData = new FormData()
      formData.append('thumbnail', file)
      const response = await fetch('/admin/announcements/thumbnails', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      return data?.key
    }
    const errors = ref({})
    const announcements = ref([])
    onMounted(() => {
      if (!addModalEl.value || !editModalEl.value) return
      addModal.value = new Modal(addModalEl.value)
      editModal.value = new Modal(editModalEl.value)
      addModalEl.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        clearErrors()
      })
      editModalEl.value.addEventListener('hidden.bs.modal', () => {
        resetForm()
        clearErrors()
      })
      fetchAnnouncements()
    })
    const openAddModal = () => {
      addModal.value?.show()
    }
    const initEdit = (announcement: Announcement) => {
      form.value.id = announcement.id
      form.value.title = announcement.title
      form.value.content = announcement.content
      editModal.value?.show()
    }
    const resetForm = () => {
      form.value = {
        id: 0,
        title: '',
        content: '',
      }
      addForm.value?.reset()
      editForm.value?.reset()
      thumbnail.value = null
    }
    const clearErrors = () => {
      errors.value = {}
    }

    const onSubmitCreate = async () => {
      try {
        clearErrors()
        let thumbnailSrc = ''
        if (thumbnail.value !== null) {
          thumbnailSrc = await uploadImage(thumbnail.value)
        }
        const response = await fetch('/admin/announcements', {
          method: 'POST',
          body: JSON.stringify({
            ...form.value,
            thumbnail: thumbnailSrc,
          }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        const responseBody = await response.json()
        if (response.status === StatusCodes.OK) {
          toastr.success('Announcement created')
          resetForm()
          addModal.value?.hide()
          fetchAnnouncements()
        }
        if (response.status === StatusCodes.BAD_REQUEST) {
          errors.value = toStructuredErrors(responseBody?.errors ?? {})
        }
      } catch (error) {
        console.error(error)
      } finally {
        isSubmitting.value = false
      }
    }
    const onSubmitUpdate = async () => {
      try {
        clearErrors()
        let thumbnailSrc = ''
        if (thumbnail.value !== null) {
          thumbnailSrc = await uploadImage(thumbnail.value)
        }
        const response = await fetch(`/admin/announcements/${form.value.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form.value, thumbnail: thumbnailSrc }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        const responseBody = await response.json()
        if (response.status === StatusCodes.OK) {
          toastr.success('Announcement updated')
          resetForm()
          editModal.value?.hide()
          fetchAnnouncements()
        }
        if (response.status === StatusCodes.BAD_REQUEST) {
          errors.value = toStructuredErrors(responseBody?.errors ?? {})
        }
      } catch (error) {
        console.log(error)
      } finally {
        isSubmitting.value = false
      }
    }
    const fetchAnnouncements = async () => {
      const response = await fetch('/admin/announcements/all', {
        method: 'GET',
      })
      const responseBody = await response.json()
      announcements.value =
        responseBody?.announcements?.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
        })) ?? []
    }
    const initDelete = async (announcement: Announcement) => {
      const result = await Swal.fire({
        title: 'Delete Announcement',
        text: 'Are youre sure you want to delete this announcement?',
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
      deleteAnnouncement(announcement.id)
    }

    const deleteAnnouncement = async (id: number) => {
      const response = await fetch(`/admin/announcements/${id}`, { method: 'DELETE' })
      if (response.status === StatusCodes.OK) {
        toastr.success('Announcement deleted.')
        fetchAnnouncements()
      }
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
      toReadableDatetime,
      announcements,
      editModalEl,
      initEdit,
      onSubmitUpdate,
      initDelete,
      handleImageAttach,
      addForm,
      editForm,
    }
  },
})
  .use(CKEditor as any)
  .mount('#announcementPage')
