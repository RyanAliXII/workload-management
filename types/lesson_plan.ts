import Faculty from '#models/faculty'
import { User } from './user.js'

export type CreateLessonPlan = {
  name: string
  grade:
    | 'grade-1'
    | 'grade-2'
    | 'grade-3'
    | 'grade-4'
    | 'grade-5'
    | 'grade-6'
    | 'grade-7'
    | 'grade-8'
    | 'grade-9'
    | 'grade-10'
    | 'grade-11'
    | 'grade-12'
  quarter: string
  startDate: Date
  endDate: Date
  weekNumber: number
  learningAreas?: string
  objective?: string
  contentStandard?: string
  performanceStandard?: string
  sessions: { texts: (string | undefined)[] }[]
  rowLabels: string[]
  facultyId: number
}
export type UpdateLessonPlan = {
  id: number
  name: string
  grade:
    | 'grade-1'
    | 'grade-2'
    | 'grade-3'
    | 'grade-4'
    | 'grade-5'
    | 'grade-6'
    | 'grade-7'
    | 'grade-8'
    | 'grade-9'
    | 'grade-10'
    | 'grade-11'
    | 'grade-12'
  quarter: string
  startDate: Date
  endDate: Date
  weekNumber: number
  learningAreas?: string
  objective?: string
  contentStandard?: string
  performanceStandard?: string
  sessions: { texts: (string | undefined)[] }[]
  rowLabels: string[]
}

export type LessonPlan = {
  id: number
  name: string
  grade:
    | 'grade-1'
    | 'grade-2'
    | 'grade-3'
    | 'grade-4'
    | 'grade-5'
    | 'grade-6'
    | 'grade-7'
    | 'grade-8'
    | 'grade-9'
    | 'grade-10'
    | 'grade-11'
    | 'grade-12'
  quarter: string
  startDate: Date
  endDate: Date
  weekNumber: number
  learningAreas?: string
  objective?: string
  contentStandard?: string
  performanceStandard?: string
  rowLabels: RowLabel[]
  sessions: Session[]
  facultyId: number
  faculty: Faculty
  comments: LessonPlanComment[]
}
export type LessonPlanComment = {
  id: number
  text: string
  user: User
}
export type RowLabel = {
  id: number
  name: string
}
export type Session = {
  id: number
  lessonPlanId: number
  values: SessionValue[]
}

export type SessionValue = {
  id: number
  text: string
}
