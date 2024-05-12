import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import type { HttpContext } from '@adonisjs/core/http'
import { UserRepository } from '#repositories/user_respository'
import { StatusCodes } from 'http-status-codes'
import { loginValidator } from '#validators/login'
import { errors } from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class LoginController {
  constructor(
    protected logger: Logger,
    protected userRepo: UserRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/login/index')
  }
  async login({ request, response }: HttpContext) {
    try {
      const body = await loginValidator.validate(request.body())
      const user = await this.userRepo.getByEmail(body.email)
      if (!user) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          message: 'Invalid username or password',
          status: StatusCodes.BAD_REQUEST,
        })
      }
      const isPasswordCorrect = await hash.verify(user.loginCredential.password, body?.password)
      if (!isPasswordCorrect) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          message: 'Invalid username or password',
          status: StatusCodes.BAD_REQUEST,
        })
      }
      return response.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'OK',
      })
    } catch (err) {
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
