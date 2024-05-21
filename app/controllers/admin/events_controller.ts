// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { createEventValidator } from '#validators/event'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class EventsController {
  constructor(
    protected logger: Logger,
    protected facultyRepo: FacultyRepository
  ) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    return view.render('admin/events/index', {
      activeFaculty,
    })
  }
  async create({ view, request, response }: HttpContext) {
    try {
      const data = await createEventValidator.validate(request.body())
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
