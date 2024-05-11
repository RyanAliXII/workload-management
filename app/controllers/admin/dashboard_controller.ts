import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class DashboardController {
  constructor(protected logger: Logger) {}
  async index({ view }: HttpContext) {
    return view.render('admin/dashboard/index')
  }
}
