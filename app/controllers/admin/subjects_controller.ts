import { HttpContext } from '@adonisjs/core/http'

export default class SubjectsController {
  async index({ view }: HttpContext) {
    return view.render('admin/subjects/index')
  }
}
