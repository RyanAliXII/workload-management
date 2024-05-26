import { createApp, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const form = ref({
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
      sessions: [] as { text: string }[],
    })
    const removeRowLabel = (index: number) => {
      form.value.rowLabels = form.value.rowLabels.filter((_, idx) => idx !== index)
    }
    const addRowLabel = () => {
      form.value.rowLabels.push('')
    }
    const addRowLabelBefore = (index: number) => {
      const rows = form.value.rowLabels
      form.value.rowLabels = [...rows.slice(0, index), '', ...rows.slice(index)]
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
      form.value.sessions.push({ text: '' })
    }

    const removeSession = (index: number) => {
      form.value.sessions = form.value.sessions.filter((_, idx) => idx !== index)
    }

    return {
      form,
      removeRowLabel,
      addRowLabel,
      addRowLabelBefore,
      addRowLabelAfter,
      addSession,
      removeSession,
    }
  },
}).mount('#createLessonPlan')
