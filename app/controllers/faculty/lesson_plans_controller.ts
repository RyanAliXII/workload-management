import { LessonPlanCommentRepository } from '#repositories/lesson_plan_comment_repository'
import { LessonPlanRepository } from '#repositories/lesson_plan_repository'
import { createFacultyCommentValidator } from '#validators/comment'
import {
  createLessonPlanValidator,
  editLessonPlanValidator,
  editPageValidator,
  idValidator,
} from '#validators/lesson_plan'

import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class LessonPlansController {
  constructor(
    protected logger: Logger,
    protected lessonPlanRepo: LessonPlanRepository,
    protected commentRepo: LessonPlanCommentRepository
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
  async viewPage({ view, request, auth, response }: HttpContext) {
    try {
      const filter = await editPageValidator.validate({
        id: request.param('id'),
        facultyId: auth.user?.id,
      })

      const lessonPlan = await this.lessonPlanRepo.getByIdAndFacultyId(filter.id, filter.facultyId)
      if (!lessonPlan) return response.abort('Not Found', StatusCodes.NOT_FOUND)

      return view.render('faculty/lesson-plans/view-lesson-plan', {
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
  async editPage({ request, response, auth, view }: HttpContext) {
    try {
      const filter = await editPageValidator.validate({
        id: request.param('id'),
        facultyId: auth.user?.id,
      })

      const lessonPlan = await this.lessonPlanRepo.getByIdAndFacultyId(filter.id, filter.facultyId)
      if (!lessonPlan) return response.abort('Not Found', StatusCodes.NOT_FOUND)
      return view.render('faculty/lesson-plans/edit-lesson-plan', {
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
      const filter = await editPageValidator.validate({
        id: request.param('id'),
        facultyId: auth.user?.id,
      })

      const lessonPlan = await this.lessonPlanRepo.getByIdAndFacultyId(filter.id, filter.facultyId)
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
  async edit({ request, response }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const data = await editLessonPlanValidator.validate(body)
      await this.lessonPlanRepo.update(data)
      return response.json({
        status: StatusCodes.OK,
        message: 'Lesson plan updated.',
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
  async delete({ request, response }: HttpContext) {
    try {
      const data = await idValidator.validate({ id: request.param('id') })
      await this.lessonPlanRepo.delete(data.id)
      return response.json({
        status: StatusCodes.OK,
        message: 'Lesson plan deleted.',
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
  async createComment({ request, response, auth }: HttpContext) {
    try {
      const body = request.body()
      body.lessonPlanId = request.param('lessonPlanId')
      body.userId = auth.user?.id
      const data = await createFacultyCommentValidator.validate(body)
      const comment = await this.commentRepo.create({ ...data, userId: null })

      return response.json({
        status: StatusCodes.OK,
        comment,
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
