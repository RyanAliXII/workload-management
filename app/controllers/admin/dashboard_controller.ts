import Event from '#models/event'
import Faculty from '#models/faculty'
import Task from '#models/task'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { format, subDays } from 'date-fns'
@inject()
export default class DashboardController {
  constructor(protected logger: Logger) {}
  async index({ view }: HttpContext) {
    const faculty = await Faculty.query().count('id as total')
    const from = subDays(new Date(), 30)
    const to = new Date()
    const fromStr = format(from, 'yyyy-MM-dd')
    const toStr = format(to, 'yyyy-MM-dd')

    const events = await Event.query().whereBetween('from', [fromStr, toStr]).count('id as total')
    const completedTask = await Task.query()
      .andWhere((b) => {
        b.whereBetween('created_at', [fromStr, toStr])
        b.whereNotNull('completed_at')
      })
      .count('id as total')
    const pendingTask = await Task.query()
      .andWhere((b) => {
        b.whereRaw(`date(created_at) between '${fromStr}' and '${toStr}'`)
        b.whereNull('completed_at')
      })
      .count('id as total')
    const f = await Faculty.query().preload('position').preload('loginCredential')
    return view.render('admin/dashboard/index', {
      facultyCount: faculty?.[0]?.$extras?.total ?? 0,
      eventCount: events?.[0]?.$extras?.total ?? 0,
      completedTaskCount: completedTask?.[0]?.$extras?.total ?? 0,
      pendingTaskCount: pendingTask?.[0]?.$extras?.total ?? 0,
      faculty: f,
    })
  }
}
