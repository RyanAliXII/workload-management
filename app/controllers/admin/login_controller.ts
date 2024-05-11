import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import type { HttpContext } from '@adonisjs/core/http'
import { UserRepository } from '#repositories/user_respository'

@inject()
export default class LoginController {
  constructor(
    protected logger: Logger,
    protected userRepo: UserRepository
  ) {}
  async index({ view, response }: HttpContext) {
    const user = await this.userRepo.getByEmail('Ryasnali456@gmail.com')
    this.logger.info(user?.givenName)
    return view.render('admin/login/index')
  }
}
