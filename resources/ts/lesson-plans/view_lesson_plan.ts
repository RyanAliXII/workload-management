import { LessonPlan, LessonPlanComment } from '#types/lesson_plan'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString, toReadableDate } from '../utils/date.js'
import { Modal } from 'bootstrap'
import { StatusCodes } from 'http-status-codes'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
const htmlcanvas = html2canvas as any
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
  comments: [] as LessonPlanComment[],
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
  faculty: '',
}
createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const lessonPlanElement = ref<HTMLDivElement | null>(null)
    const commentModalEl = ref<HTMLDivElement | null>(null)
    const commentModal = ref<InstanceType<typeof Modal> | null>(null)
    const comment = ref<string>('')
    onMounted(() => {
      fetchLessonPlan()

      if (!commentModalEl.value) return
      commentModal.value = new Modal(commentModalEl.value)
    })
    const openCommentModal = () => {
      commentModal.value?.show()
    }
    const form = ref({ ...INITIAL_VALUES })

    const fetchLessonPlan = async () => {
      const response = await fetch(`/admin/lesson-plans/one/${window.viewData?.lessonPlanId}`, {
        headers: new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }),
      })
      const data = await response.json()
      if (data?.lessonPlan) {
        const plan = data?.lessonPlan as LessonPlan
        ;(form.value.id = plan.id), (form.value.name = plan.name)
        form.value.startDate = new Date(plan.startDate)
        form.value.faculty = `${plan.faculty.givenName} ${plan.faculty.surname}`
        form.value.endDate = new Date(plan.endDate)
        form.value.grade = plan.grade
        form.value.weekNumber = plan.weekNumber
        form.value.quarter = plan.quarter
        form.value.learningAreas = plan.learningAreas ?? ''
        form.value.objective = plan.objective ?? ''
        form.value.contentStandard = plan.contentStandard ?? ''
        form.value.performanceStandard = plan.performanceStandard ?? ''
        form.value.rowLabels = plan.rowLabels.map((l) => l.name)
        form.value.comments = plan.comments
        form.value.sessions = plan.sessions.map((s) => ({
          texts: s.values.map((value) => value.text),
        }))
      }
    }
    const onCreateComment = async () => {
      const response = await fetch(`/admin/lesson-plans/${form.value.id}/comments`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          text: comment.value,
        }),
      })
      if (response.status === StatusCodes.OK) {
        comment.value = ''
        fetchLessonPlan()
      }
    }
    const download = async () => {
      if (!lessonPlanElement.value) return
      const canvas = await htmlcanvas(lessonPlanElement.value, { scale: 2, quality: 1 })
      const document = new jsPDF({ format: 'a4', unit: 'in' })
      document.addImage(canvas, 0.1, 0.1, 7.1, 8.6)
      document.save('lesson_plan.pdf')
    }
    return {
      form,
      toReadableDate,
      toISO8601DateString,
      openCommentModal,
      commentModalEl,
      comment,
      lessonPlanElement,
      onCreateComment,
      download,
    }
  },
}).mount('#viewLessonPlan')
