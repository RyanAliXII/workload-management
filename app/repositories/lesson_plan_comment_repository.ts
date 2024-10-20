import LessonPlanComment from '#models/lesson_plan_comment'
import { inject } from '@adonisjs/core'

@inject()
export class LessonPlanCommentRepository {
  async create(comment: { text: string; userId: number | null; lessonPlanId: number }) {
    return LessonPlanComment.create(comment)
  }
}
