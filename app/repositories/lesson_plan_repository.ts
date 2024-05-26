import LessonPlan from '#models/lesson_plan'
import LessonPlanRowLabel from '#models/lesson_plan_row_label'
import LessonPlanSession from '#models/lesson_plan_session'
import LessonPlanSessionValue from '#models/lesson_plan_session_value'
import { CreateLessonPlan } from '#types/lesson_plan'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

@inject()
export class LessonPlanRepository {
  async getByFacultyId(facultyId: number) {
    return LessonPlan.query()
      .where('faculty_id', facultyId)
      .preload('faculty')
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
  }
  async create(plan: CreateLessonPlan) {
    const trx = await db.transaction()
    try {
      const lessonPlan = await LessonPlan.create(
        {
          name: plan.name,
          grade: plan.grade,
          quarter: plan.quarter,
          weekNumber: plan.weekNumber,
          startDate: DateTime.fromJSDate(plan.startDate),
          endDate: DateTime.fromJSDate(plan.endDate),
          learningAreas: plan.learningAreas ?? '',
          objective: plan.objective ?? '',
          contentStandard: plan.contentStandard ?? '',
          performanceStandard: plan.performanceStandard ?? '',
          facultyId: plan.facultyId,
        },
        { client: trx }
      )
      await LessonPlanRowLabel.createMany(
        plan.rowLabels.map((l) => ({ name: l, lessonPlanId: lessonPlan.id })),
        {
          client: trx,
        }
      )
      for (const s of plan.sessions) {
        const session = await LessonPlanSession.create(
          { lessonPlanId: lessonPlan.id },
          { client: trx }
        )
        for (const text of s.texts) {
          await LessonPlanSessionValue.create(
            { sessionId: session.id, text: text ?? '' },
            { client: trx }
          )
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
