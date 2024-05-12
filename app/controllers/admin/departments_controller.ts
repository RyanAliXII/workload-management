import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class DepartmentsController {
  async Index({ view }: HttpContext) {
    view.render('admin/departments/index')
  }
}
