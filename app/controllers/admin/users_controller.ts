import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class UsersController {
  async index({ view }: HttpContext) {
    return view.render('admin/users/index')
  }
}
