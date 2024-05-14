import { FundSourceRepository } from '#repositories/fund_source_respository'
import { createFundSourceValidator } from '#validators/fund_source'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class FundSourcesController {
  constructor(
    protected logger: Logger,
    protected fundSourceRepo: FundSourceRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/fund_sources/index')
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createFundSourceValidator.validate(request.body())
      const position = this.fundSourceRepo.create(body)
      return response.send({
        status: StatusCodes.OK,
        message: 'Fund source added.',
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
