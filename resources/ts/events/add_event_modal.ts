import { createApp, onMounted, ref } from 'vue'
import MultiSelect from 'primevue/multiselect'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import Faculty from '#models/faculty'
createApp({
  components: {
    'multi-select': MultiSelect,
  },
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const form = ref({
      name: '',
      from: new Date(),
      to: new Date(),
      facilitators: [],
      description: '',
    })
    const activeFaculty = ref<Faculty[]>([])
    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
    })

    const errors = ref({})
    const onSubmitCreate = () => {}
    return { form, onSubmitCreate, errors, activeFaculty }
  },
})
  .use(PrimeVue as any)
  .mount('#addEventModal')
