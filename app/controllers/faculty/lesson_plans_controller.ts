import type { HttpContext } from '@adonisjs/core/http'

export default class LessonPlansController {
  async index({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/index')
  }
}
