import { LessonPlanRepository } from '#repositories/lesson_plan_repository'
import { createLessonPlanValidator } from '#validators/lesson_plan'
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
      const lessonPlans = await this.lessonPlanRepo.getByFacultyId(auth.user?.id ?? 0)
      return response.json({
        status: StatusCodes.OK,
        message: 'lesson plan fetched.',
        lessonPlans,
      })
    }
    return view.render('faculty/lesson-plans/index')
  }
  async createPage({ view }: HttpContext) {
    return view.render('faculty/lesson-plans/add-lesson-plan')
  }
  async create({ request, response, auth }: HttpContext) {
    try {
      const body = request.body()
      body.facultyId = auth.user?.id
      const data = await createLessonPlanValidator.validate(body)
      await this.lessonPlanRepo.create(data)
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
