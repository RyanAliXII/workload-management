import { Tab } from 'bootstrap'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString, toReadableDate } from '../../utils/date.js'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../../utils/form.js'
import toastr from 'toastr'
import { LessonPlan } from '#types/lesson_plan'
const INITIAL_VALUES = {
  id: 0,
  name: '',
  grade: '',
  quarter: '',
  weekNumber: 0,
  startDate: new Date(),
  endDate: new Date(),
  learningAreas: '',
  objective: '',
  contentStandard: '',
  performanceStandard: '',
  rowLabels: [
    `C. Learning Competencies / Objectives
    Write the LC code for each`,
    `II. CONTENT`,
    `III. LEARNING RESOURCES`,
    `A. References`,
    `1. Teacher’s Guide Pages`,
    `3. Textbook pages`,
    `4. Additional Materials from Learning
      Resource (LR) portal`,
    `B.  Other Learning Resources`,
    `A. Reviewing previous  lesson or presenting the new lesson`,
    `B. Establishing a purpose for the lesson`,
    `C. Presenting examples/ instances of the new lesson`,
    `D. Discussing new concepts and practicing new skills #1`,
    `E. Discussing new concepts and practicing new skills #2`,
    `F. Developing Mastery
      (Leads to Formative Assessment 3)`,
    `G. Finding practical applications of concepts and skills in daily living`,
    `H. Making generalizations and abstractions about the lesson`,
    `I.  Evaluating learning`,
    `J. Additional activities for application or remediation`,
    `V. REMARKS`,
    `VI. REFLECTION`,
    `A. No.of learners who earned 80% on the formative assessment`,
    `B. No.of learners who require additional activities for remediation`,
    `C. Did the remedial lessons work? No.of learners who have caught up with the lesson`,
    `D. No.of learners who continue to require remediation`,
    `E. Which of my teaching strategies worked well? Why did these work?`,
    `F. What difficulties did I encounter which my principal or supervisor can help me solve?`,
    `G. What innovation or localized materials did I use/discover which I wish to share with other teachers?`,
  ],
  sessions: [] as { texts: string[] }[],
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const formTabTriggerEl = ref<HTMLButtonElement | null>()
    const tableViewTabTriggerEl = ref<HTMLButtonElement | null>()
    const formTabTrigger = ref<InstanceType<typeof Tab> | null>(null)
    const tableViewTabTrigger = ref<InstanceType<typeof Tab> | null>(null)
    const errors = ref({})

    onMounted(() => {
      if (formTabTriggerEl.value && tableViewTabTriggerEl.value) {
        formTabTrigger.value = new Tab(formTabTriggerEl.value)
        tableViewTabTrigger.value = new Tab(tableViewTabTriggerEl.value)
        formTabTriggerEl.value.addEventListener('click', function (event) {
          event.preventDefault()
          formTabTrigger.value?.show()
        })
        tableViewTabTriggerEl.value.addEventListener('click', function (event) {
          event.preventDefault()

          tableViewTabTrigger.value?.show()
        })
      }
      fetchLessonPlan()
    })
    const form = ref({ ...INITIAL_VALUES })
    const removeRowLabel = (index: number) => {
      form.value.rowLabels = form.value.rowLabels.filter((_, idx) => idx !== index)
      form.value.sessions = form.value.sessions.map((s) => {
        s.texts[index] = ''
        return s
      })
    }
    const addRowLabel = () => {
      form.value.rowLabels.push('')
    }
    const addRowLabelBefore = (index: number) => {
      const rows = form.value.rowLabels
      form.value.rowLabels = [...rows.slice(0, index), '', ...rows.slice(index)]
      form.value.sessions = form.value.sessions.map((s) => {
        return s
      })
    }
    const addRowLabelAfter = (index: number) => {
      if (index === form.value.rowLabels.length - 1) {
        form.value.rowLabels.push('')
        return
      }
      const rows = form.value.rowLabels
      form.value.rowLabels = [...rows.slice(0, index + 1), '', ...rows.slice(index + 1)]
    }
    const addSession = () => {
      form.value.sessions.push({ texts: [] })
    }

    const removeSession = (index: number) => {
      form.value.sessions = form.value.sessions.filter((_, idx) => idx !== index)
    }
    const handleDateInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value
      const name = target.name as 'startDate' | 'endDate'
      form.value[name] = new Date(value)
    }
    const resetForm = () => {
      form.value = { ...INITIAL_VALUES, rowLabels: [...INITIAL_VALUES.rowLabels], sessions: [] }
    }
    const clearErrors = () => {
      errors.value = {}
    }
    const onSubmitCreate = async () => {
      try {
        clearErrors()
        const data = {
          ...form.value,
          startDate: toISO8601DateString(form.value.startDate),
          endDate: toISO8601DateString(form.value.endDate),
        }
        const response = await fetch(`/faculties/lesson-plans/${form.value.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        const responseBody = await response.json()
        if (response.status === StatusCodes.OK) {
          toastr.success('Lesson plan has been updated.')
        }
        if (response.status === StatusCodes.BAD_REQUEST) {
          errors.value = toStructuredErrors(responseBody?.errors ?? {})
        }
        if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
          toastr.error('Unknown error occured.')
        }
      } catch (error) {}
    }

    const fetchLessonPlan = async () => {
      const response = await fetch(`/faculties/lesson-plans/one/${window.viewData?.lessonPlanId}`, {
        headers: new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }),
      })
      const data = await response.json()
      if (data?.lessonPlan) {
        const plan = data?.lessonPlan as LessonPlan
        form.value.id = plan.id
        form.value.name = plan.name
        form.value.startDate = new Date(plan.startDate)
        form.value.endDate = new Date(plan.endDate)
        form.value.grade = plan.grade
        form.value.weekNumber = plan.weekNumber
        form.value.quarter = plan.quarter
        form.value.learningAreas = plan.learningAreas ?? ''
        form.value.objective = plan.objective ?? ''
        form.value.contentStandard = plan.contentStandard ?? ''
        form.value.performanceStandard = plan.performanceStandard ?? ''
        form.value.rowLabels = plan.rowLabels.map((l) => l.name)
        form.value.sessions = plan.sessions.map((s) => ({
          texts: s.values.map((value) => value.text),
        }))
      }
    }
    return {
      form,
      removeRowLabel,
      addRowLabel,
      addRowLabelBefore,
      addRowLabelAfter,
      addSession,
      removeSession,
      formTabTriggerEl,
      tableViewTabTriggerEl,
      toReadableDate,
      handleDateInput,
      toISO8601DateString,
      errors,
      onSubmitCreate,
    }
  },
}).mount('#createLessonPlan')
