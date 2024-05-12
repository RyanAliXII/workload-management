import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { messages } from '@vinejs/vine/defaults'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class DepartmentsController {
  async index({ view }: HttpContext) {
    return view.render('admin/departments/index')
  }
  async create({ response }: HttpContext) {
    return response.status(StatusCodes.OK).send({ messages: 'OK' })
  }
}
