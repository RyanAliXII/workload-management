import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class DepartmentsController {
  async index({ view }: HttpContext) {
    return view.render('admin/departments/index')
  }
  async create({}: HttpContext)
}
