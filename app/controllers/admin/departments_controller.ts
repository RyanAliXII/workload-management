import { DepartmentRepository } from '#repositories/department_repository'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'

import { StatusCodes } from 'http-status-codes'

@inject()
export default class DepartmentsController {
  constructor(
    protected logger: Logger,
    protected deparmentRepo: DepartmentRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/departments/index')
  }
  async create({ response }: HttpContext) {
    return response.status(StatusCodes.OK).send({ messages: 'OK' })
  }
}
