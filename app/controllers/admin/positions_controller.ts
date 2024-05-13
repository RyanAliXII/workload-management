import { PositionRepository } from '#repositories/position_repository'
import { createPositionValidator, editPositionValidator } from '#validators/position'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class PositionsController {
  constructor(
    protected logger: Logger,
    protected positionRepo: PositionRepository
  ) {}
  async index({ view, request, response }: HttpContext) {
    const contentType = await request.headers()['content-type']
    if (contentType === 'application/json') {
      const positions = await this.positionRepo.getAll()
      return response.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'Positions fetched.',
        positions,
      })
    }
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
  async edit({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const body = request.body()
      body.id = id
      const parsedBody = await editPositionValidator.validate(body)
      const position = this.positionRepo.create(parsedBody)
      return response.send({
        status: StatusCodes.OK,
        message: 'Position updated.',
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
