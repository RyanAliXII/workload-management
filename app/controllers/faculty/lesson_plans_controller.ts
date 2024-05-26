import { createLessonPlanValidator } from '#validators/lesson_plan'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class LessonPlansController {
  constructor(protected logger: Logger) {}
  async index({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/index')
  }
  async createPage({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/add-lesson-plan')
  }
  async create({ request, response }: HttpContext) {
    try {
      const data = await createLessonPlanValidator.validate(request.body())

      return response.json({
        status: StatusCodes.OK,
        message: 'Lesson plan created.',
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.error(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured',
      })
    }
  }
}
