import { LessonPlanRepository } from '#repositories/lesson_plan_repository'
import { idValidator } from '#validators/lesson_plan'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class LessonPlansController {
  constructor(
    protected logger: Logger,
    protected lessonPlanRepo: LessonPlanRepository
  ) {}
  async index({ view, auth, request, response }: HttpContext) {
    const contentType = request.header('content-type')
    if (contentType === 'application/json') {
      const lessonPlans = await this.lessonPlanRepo.getAll()
      return response.json({
        status: StatusCodes.OK,
        message: 'lesson plan fetched.',
        lessonPlans,
      })
    }
    return view.render('admin/lesson-plans/index')
  }
  async viewPage({ view, request, response }: HttpContext) {
    try {
      const filter = await idValidator.validate({
        id: request.param('id'),
      })

      const lessonPlan = await this.lessonPlanRepo.getById(filter.id)
      if (!lessonPlan) return response.abort('Not Found', StatusCodes.NOT_FOUND)

      return view.render('admin/lesson-plans/view-lesson-plan', {
        lessonPlanId: lessonPlan.id,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
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
  async getOne({ request, response, auth }: HttpContext) {
    try {
      const filter = await idValidator.validate({
        id: request.param('id'),
      })
      const lessonPlan = await this.lessonPlanRepo.getById(filter.id)
      if (!lessonPlan) return response.abort('Not Found', StatusCodes.NOT_FOUND)
      return response.json({
        status: StatusCodes.OK,
        message: 'lesson plan fetched',
        lessonPlan,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
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
