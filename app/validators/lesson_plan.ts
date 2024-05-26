import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'
import LessonPlan from '#models/lesson_plan'

export const createLessonPlanValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
    grade: vine.enum([
      'grade-1',
      'grade-2',
      'grade-3',
      'grade-4',
      'grade-5',
      'grade-6',
      'grade-7',
      'grade-8',
      'grade-9',
      'grade-10',
      'grade-11',
      'grade-12',
    ]),
    quarter: vine.enum(['quarter-1', 'quarter-2', 'quarter-3', 'quarter-4']),
    startDate: vine.date(),
    endDate: vine.date().afterOrSameAs('startDate'),
    weekNumber: vine.number().min(1),
    learningAreas: vine.string().optional(),
    objective: vine.string().optional(),
    contentStandard: vine.string().optional(),
    performanceStandard: vine.string().optional(),
    rowLabels: vine.array(vine.string().trim()).minLength(1),
    facultyId: vine.number().min(1),
    sessions: vine
      .array(
        vine.object({
          texts: vine.array(vine.string().optional()),
        })
      )
      .minLength(1),
  })
)
createLessonPlanValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editPageValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    facultyId: vine.number().min(1),
  })
)
export const editLessonPlanValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75).trim(),
    grade: vine.enum([
      'grade-1',
      'grade-2',
      'grade-3',
      'grade-4',
      'grade-5',
      'grade-6',
      'grade-7',
      'grade-8',
      'grade-9',
      'grade-10',
      'grade-11',
      'grade-12',
    ]),
    quarter: vine.enum(['quarter-1', 'quarter-2', 'quarter-3', 'quarter-4']),
    startDate: vine.date(),
    endDate: vine.date().afterOrSameAs('startDate'),
    weekNumber: vine.number().min(1),
    learningAreas: vine.string().optional(),
    objective: vine.string().optional(),
    contentStandard: vine.string().optional(),
    performanceStandard: vine.string().optional(),
    rowLabels: vine.array(vine.string().trim()).minLength(1),
    sessions: vine
      .array(
        vine.object({
          texts: vine.array(vine.string().optional()),
        })
      )
      .minLength(1),
  })
)
editLessonPlanValidator.errorReporter = () => new JSONAPIErrorReporter()

const idValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
