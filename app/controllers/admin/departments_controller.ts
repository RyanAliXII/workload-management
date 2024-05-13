import { DepartmentRepository } from '#repositories/department_repository'
import {
  createDepartmentValidator,
  deleteDepartmentValidator,
  editDepartmentValidator,
} from '#validators/department'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
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
      const departments = await this.departmentRepo.getAll()
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

  async edit({ response, request }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const parsedBody = await editDepartmentValidator.validate(body)
      const department = await this.departmentRepo.update(parsedBody)
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
  async delete({ request, response }: HttpContext) {
    const id = request.param('id')
    try {
      const body = await deleteDepartmentValidator.validate({ id })
      this.departmentRepo.delete(body.id)
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
