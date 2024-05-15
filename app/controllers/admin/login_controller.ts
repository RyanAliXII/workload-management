import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import type { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
import { errors } from '@vinejs/vine'
import { errors as authErrors } from '@adonisjs/auth'
import { loginValidator } from '#validators/login'
import { UserRepository } from '#repositories/user_respository'

import AuthUser from '#models/auth_user'

@inject()
export default class LoginController {
  constructor(
    protected logger: Logger,
    protected userRepo: UserRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/login/index')
  }
  async login({ request, response, auth }: HttpContext) {
    try {
      const body = await loginValidator.validate(request.body())
      const user = await AuthUser.verifyCredentials(body.email, body.password)
      await auth.use('admin').login(user)
      return response.json({
        status: StatusCodes.OK,
        message: 'OK',
      })
    } catch (err) {
      if (err instanceof authErrors.E_INVALID_CREDENTIALS) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Invalid username or password',
          status: StatusCodes.BAD_REQUEST,
        })
      }
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation error',
          errors: err.messages,
          status: StatusCodes.BAD_REQUEST,
        })
      }
      this.logger.error(err)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
}
