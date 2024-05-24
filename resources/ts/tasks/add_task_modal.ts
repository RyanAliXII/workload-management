import { computed, createApp, onMounted, ref } from 'vue'
import Dropdown from 'primevue/dropdown'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { Faculty } from '#types/faculty'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
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
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
    })
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
    const form = ref({
      name: '',
      fileAttachments: [],
      description: '',
      facultyId: 0,
    })
    const facultyOptions = computed(
      () =>
        activeFaculty?.value?.map((f) => ({
          value: f.id,
          label: `${f.givenName} ${f.middleName} ${f.surname}`,
        })) ?? []
    )
    const errors = ref({})
    const onSubmitCreate = () => {}

    return { form, errors, onSubmitCreate, facultyOptions, editor, editorConfig }
  },
})
  .use(PrimeVue as any)
  .use(CKEditor as any)
  .mount('#addTaskModal')
