// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'

export default class EducationalAttainmentsController {
  async index({ view }: HttpContext) {
    return view.render('admin/educational_attainments/index')
  }
}
