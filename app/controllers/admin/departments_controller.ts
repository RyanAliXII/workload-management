import { DepartmentRepository } from '#repositories/department_repository'
import { createDepartmentValidator } from '#validators/department'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'

import { StatusCodes } from 'http-status-codes'

@inject()
export default class DepartmentsController {
  constructor(
    protected logger: Logger,
    protected departmentRepo: DepartmentRepository
  ) {}
  async index({ view, request, response }: HttpContext) {
    const contentType = request.headers()['content-type']
    if (contentType === 'application/json') {
      const departments = await this.departmentRepo.getDepartments()
      return response.status(StatusCodes.OK).send({
        status: StatusCodes.OK,
        message: 'Departments fetched.',
        departments,
      })
    }
    return view.render('admin/departments/index')
  }
  async create({ response, request }: HttpContext) {
    try {
      const body = await createDepartmentValidator.validate(request.body())
      const department = await this.departmentRepo.create(body)
      return response.status(StatusCodes.OK).send({ messages: 'OK', department })
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
