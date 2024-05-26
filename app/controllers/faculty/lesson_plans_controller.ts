import type { HttpContext } from '@adonisjs/core/http'

export default class LessonPlansController {
  async index({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/index')
  }
  async createPage({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/add-lesson-plan')
  }
}
