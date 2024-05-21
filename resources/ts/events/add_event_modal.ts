import { computed, createApp, onMounted, ref } from 'vue'
import MultiSelect from 'primevue/multiselect'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/md-light-indigo/theme.css'
import { OptionWithMeta } from '#types/option'
import { Faculty } from '#types/faculty'
import { toISO8601DateString } from '../utils/date.js'
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
      status: 'approved',
    })

    const activeFaculty = ref<Faculty[]>([])
    const facilitators = computed<OptionWithMeta<number, Faculty>[]>(() =>
      activeFaculty.value.map((f) => ({
        value: f.id,
        label: `${f.givenName} ${f.middleName} ${f.surname}`,
        meta: f,
      }))
    )

    onMounted(() => {
      activeFaculty.value = window.viewData?.activeFaculty ?? []
    })
    const handleDateInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value
      const name = target.name as 'from' | 'to'
      form.value[name] = new Date(value)
    }
    const errors = ref({})
    const onSubmitCreate = () => {}
    return { form, onSubmitCreate, errors, facilitators, toISO8601DateString, handleDateInput }
  },
})
  .use(PrimeVue as any)
  .mount('#addEventModal')
