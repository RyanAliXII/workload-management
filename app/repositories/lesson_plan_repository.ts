import LessonPlan from '#models/lesson_plan'
import LessonPlanRowLabel from '#models/lesson_plan_row_label'
import LessonPlanSession from '#models/lesson_plan_session'
import LessonPlanSessionValue from '#models/lesson_plan_session_value'
import { CreateLessonPlan, UpdateLessonPlan } from '#types/lesson_plan'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

@inject()
export class LessonPlanRepository {
  async getByFacultyId(facultyId: number) {
    return LessonPlan.query()
      .where('faculty_id', facultyId)
      .preload('faculty', (b) => {
        b.preload('position')
      })
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
      .orderBy('created_at', 'desc')
  }
  async getAll() {
    return LessonPlan.query()
      .preload('faculty', (b) => {
        b.preload('position')
      })
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
      .orderBy('created_at', 'desc')
  }
  async getByDepartmentId(departmentId: number) {
    return LessonPlan.query()
      .innerJoin('faculty', 'faculty_id', 'faculty.id')
      .where('department_id', departmentId)
      .preload('faculty', (b) => {
        b.preload('position')
      })
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
      .orderBy('lesson_plan.created_at', 'desc')
  }
  async getByIdAndFacultyId(id: number, facultyId: number) {
    return LessonPlan.query()
      .andWhere((b) => {
        b.where('id', id)
        b.where('facultyId', facultyId)
      })
      .preload('faculty', (b) => {
        b.preload('position')
      })
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
      .preload('comments', (b) => {
        b.preload('user')
      })
      .limit(1)
      .first()
  }
  async getById(id: number) {
    return LessonPlan.query()
      .where('id', id)
      .preload('faculty', (b) => {
        b.preload('position')
      })
      .preload('rowLabels', (b) => {
        b.orderBy('id', 'asc')
      })
      .preload('sessions', (b) => {
        b.preload('values', (builder) => {
          builder.orderBy('id', 'asc')
        })
      })
      .preload('comments', (b) => {
        b.preload('user')
      })
      .limit(1)
      .first()
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

        for (const [index] of plan.rowLabels.entries()) {
          const value = s.texts?.[index] ?? ''
          await LessonPlanSessionValue.create(
            { sessionId: session.id, text: value },
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
  async update(plan: UpdateLessonPlan) {
    const trx = await db.transaction()
    try {
      const lessonPlan = await LessonPlan.findBy('id', plan.id)
      if (!lessonPlan) {
        trx.rollback()
        return
      }
      lessonPlan.useTransaction(trx)
      lessonPlan.name = plan.name
      lessonPlan.grade = plan.grade
      lessonPlan.quarter = plan.quarter
      lessonPlan.weekNumber = plan.weekNumber
      lessonPlan.startDate = DateTime.fromJSDate(plan.startDate)
      lessonPlan.endDate = DateTime.fromJSDate(plan.endDate)
      lessonPlan.learningAreas = plan.learningAreas ?? ''
      lessonPlan.objective = plan.objective ?? ''
      lessonPlan.contentStandard = plan.contentStandard ?? ''
      lessonPlan.performanceStandard = plan.performanceStandard ?? ''
      await lessonPlan.save()
      await LessonPlanRowLabel.query({ client: trx })
        .delete()
        .where('lesson_plan_id', lessonPlan.id)

      await LessonPlanRowLabel.createMany(
        plan.rowLabels.map((l) => ({ name: l, lessonPlanId: lessonPlan.id })),
        {
          client: trx,
        }
      )
      const sessions = await LessonPlanSession.query().where('lesson_plan_id', lessonPlan.id)
      for (const session of sessions) {
        session.useTransaction(trx)
        await LessonPlanSessionValue.query({
          client: trx,
        })
          .where('session_id', session.id)
          .delete()
        await session.delete()
      }
      for (const s of plan.sessions) {
        const session = await LessonPlanSession.create(
          { lessonPlanId: lessonPlan.id },
          { client: trx }
        )

        for (const [index] of plan.rowLabels.entries()) {
          const value = s.texts?.[index] ?? ''
          await LessonPlanSessionValue.create(
            { sessionId: session.id, text: value },
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
  async delete(id: number) {
    const lessonPlan = await LessonPlan.findBy('id', id)
    if (!lessonPlan) return
    lessonPlan?.delete()
  }
}
