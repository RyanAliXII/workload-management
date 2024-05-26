import EventFacilitator from '#models/event_facilitator'
import LessonPlan from '#models/lesson_plan'
import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'
import { subDays, format } from 'date-fns'

const toReadableDate = (date: Date) => {
  if (!date) return ''
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    const from = subDays(new Date(), 30)
    const to = new Date()
    const fromStr = format(from, 'yyyy-MM-dd')
    const toStr = format(to, 'yyyy-MM-dd')
    const lessonPlan = await LessonPlan.query()
      .andWhere((b) => {
        b.whereRaw(`date(created_at) between '${fromStr}' and '${toStr}'`)
        b.where('faculty_id', auth.user?.id ?? 0)
      })
      .count('id  as total')
    const eventFacilitator = await EventFacilitator.query()
      .andWhere((b) => {
        b.whereRaw(`date(event.created_at) between '${fromStr}' and '${toStr}'`)
        b.where('faculty_id', auth.user?.id ?? 0)
      })
      .innerJoin('event', 'event_id', 'event.id')
      .count('event_facilitator.id as total')
    const completedTask = await Task.query()
      .andWhere((b) => {
        b.whereRaw(`date(created_at) between '${fromStr}' and '${toStr}'`)
        b.where('faculty_id', auth.user?.id ?? 0)
        b.whereNotNull('completed_at')
      })
      .count('id  as total')
    const pendingTask = await Task.query()
      .andWhere((b) => {
        b.whereRaw(`date(created_at) between '${fromStr}' and '${toStr}'`)
        b.where('faculty_id', auth.user?.id ?? 0)
        b.whereNull('completed_at')
      })
      .count('id  as total')
    const eventsFacilitated = await EventFacilitator.query()
      .where('faculty_id', auth.user?.id ?? 0)
      .preload('event')

    return view.render('faculty/dashboard/index', {
      lessonPlanCount: lessonPlan?.[0]?.$extras?.total ?? 0,
      eventsFacilitatedCount: eventFacilitator?.[0]?.$extras?.total ?? 0,
      completedTaskCount: completedTask?.[0]?.$extras?.total ?? 0,
      pendingTaskCount: pendingTask?.[0]?.$extras?.total ?? 0,
      eventsFacilitated: eventsFacilitated.map((ef) => ({
        ...ef,
        event: {
          ...ef.event,
          name: ef.event?.name,
          location: ef.event?.location,
          status: ef.event?.status,
          description: ef.event?.description,
          to: toReadableDate(ef.event?.to?.toJSDate()),
          from: toReadableDate(ef.event?.from?.toJSDate()),
        },
      })),
    })
  }
}
