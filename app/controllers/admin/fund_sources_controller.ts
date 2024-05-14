import { FundSourceRepository } from '#repositories/fund_source_respository'
import {
  createFundSourceValidator,
  deleteFundSourceValidator,
  editFundSourceValidator,
} from '#validators/fund_source'
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
  async index({ view, request, response }: HttpContext) {
    const contentType = request.header('content-type')
    if (contentType === 'application/json') {
      const fundSources = await this.fundSourceRepo.getAll()
      return response.send({
        status: StatusCodes.OK,
        message: 'Fund sources fetched.',
        fundSources,
      })
    }
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
  async edit({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const body = request.body()
      body.id = id
      const parsedBody = await editFundSourceValidator.validate(body)
      const fundSource = await this.fundSourceRepo.update(parsedBody)
      return response.send({
        status: StatusCodes.OK,
        message: 'Fund source updated.',
        fundSource,
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
  async delete({ request, response }: HttpContext) {
    const id = request.param('id')
    try {
      const body = await deleteFundSourceValidator.validate({ id })
      await this.fundSourceRepo.delete(body.id)
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
        messages: 'Unknown error occured.',
      })
    }
  }
}
