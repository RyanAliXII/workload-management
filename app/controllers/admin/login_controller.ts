import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

@inject()
export default class LoginController {
  constructor(protected logger: Logger) {}
  async index({ view, response }: HttpContext) {
    // const user = await User.query()
    //   .preload('loginCredential', (builder) => {
    //     builder.where('email', 'ryanali456@gmail.com')
    //   })
    //   .first()

    return view.render('admin/login/index')
  }
}
