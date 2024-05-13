import { PositionRepository } from '#repositories/position_repository'
import { createPositionValidator } from '#validators/position'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { messages } from '@vinejs/vine/defaults'
import { StatusCodes } from 'http-status-codes'

export default class PositionsController {
  constructor(
    protected logger: Logger,
    protected positionRepo: PositionRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/positions/index')
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createPositionValidator.validate(request.body())
      const position = this.positionRepo.create(body)
      return response.send({
        status: StatusCodes.OK,
        message: 'Position added.',
        position,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.error(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured',
      })
    }
  }
}
