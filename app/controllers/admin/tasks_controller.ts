// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { createTaskValidator } from '#validators/task'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class TasksController {
  constructor(
    protected facultyRepo: FacultyRepository,
    protected logger: Logger
  ) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    return view.render('admin/tasks/index', {
      activeFaculty,
    })
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createTaskValidator.validate(request.body())

      //const faculty = await this.facultyRepo.create(body)
      return response.json({
        status: StatusCodes.OK,
        message: 'Task added.',
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation errors.',
          errors: error.messages,
        })
      }
      this.logger.error(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred.',
      })
    }
  }
}
