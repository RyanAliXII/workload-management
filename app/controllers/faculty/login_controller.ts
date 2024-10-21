import AuthFaculty from '#models/auth_faculty'
import { loginValidator } from '#validators/login'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { errors as authErrors } from '@adonisjs/auth'
import { StatusCodes } from 'http-status-codes'
import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class LoginController {
  constructor(protected logger: Logger) {}
  async index({ view }: HttpContext) {
    return view.render('faculty/login/index')
  }
  async login({ request, response, auth }: HttpContext) {
    try {
      const body = await loginValidator.validate(request.body())
      const user = await AuthFaculty.verifyCredentials(body.email, body.password)
      await auth.use('faculty').login(user)
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
  async logout({ response, auth }: HttpContext) {
    await auth.use('faculty').logout()
    response.redirect('/faculties/login')
  }
}
