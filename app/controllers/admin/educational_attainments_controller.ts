import { EducationalAttainmentRepository } from '#repositories/educational_attainment_repository'
import {
  createEducationalAttainmentValidator,
  deleteEducationalAttainmentValidator,
  editEducationalAttainmentValidator,
} from '#validators/educational_attainment'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class EducationalAttainmentsController {
  constructor(
    protected logger: Logger,
    protected educationalAttainmentRepo: EducationalAttainmentRepository
  ) {}
  async index({ view, request, response }: HttpContext) {
    const contentType = request.header('Content-Type')
    if (contentType === 'application/json') {
      const educationalAttainments = await this.educationalAttainmentRepo.getAll()
      return response.send({
        status: StatusCodes.OK,
        messages: 'Educational attainments fetched.',
        educationalAttainments,
      })
    }
    return view.render('admin/educational_attainments/index')
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createEducationalAttainmentValidator.validate(request.body())
      const educationalAttainment = await this.educationalAttainmentRepo.create(body)
      return response.send({
        status: StatusCodes.OK,
        message: 'Educational attainment added.',
        educationalAttainment,
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
      const body = request.body()
      body.id = request.param('id')
      const parsedBody = await editEducationalAttainmentValidator.validate(body)
      const educationalAttainment = await this.educationalAttainmentRepo.update(parsedBody)
      return response.send({
        status: StatusCodes.OK,
        message: 'Educational attainment updated.',
        educationalAttainment,
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
    try {
      const body = await deleteEducationalAttainmentValidator.validate({
        id: request.param('id'),
      })
      await this.educationalAttainmentRepo.delete(body.id)
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
