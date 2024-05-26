import type { HttpContext } from '@adonisjs/core/http'

export default class AnnouncementsController {
  async index({ view }: HttpContext) {
    return view.render('admin/announcements/index')
  }
}
