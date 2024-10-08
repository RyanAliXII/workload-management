import { SubjectRepository } from '#repositories/subject_repository'
import {
  createSubjectValidator,
  deleteSubjectValidator,
  editSubjectValidator,
} from '#validators/subject'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class SubjectsController {
  constructor(
    protected logger: Logger,
    protected subjectRepo: SubjectRepository
  ) {}
  async index({ view, request, response }: HttpContext) {
    const contentType = request.header('Content-Type')
    if (contentType === 'application/json') {
      const subjects = await this.subjectRepo.getAll()
      return response.send({
        status: StatusCodes.OK,
        message: 'subjects fetched.',
        subjects,
      })
    }
    return view.render('admin/subjects/index')
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createSubjectValidator.validate(request.body())
      const subject = await this.subjectRepo.create(body)
      return response.send({
        status: StatusCodes.OK,
        message: 'Subject created.',
        subject: subject,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
  async edit({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const body = request.body()
      body.id = id
      const parsedBody = await editSubjectValidator.validate(body)
      const subject = await this.subjectRepo.update(parsedBody)
      return response.send({
        status: StatusCodes.OK,
        message: 'Subject updated.',
        subject: subject,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
  async delete({ request, response }: HttpContext) {
    try {
      const body = await deleteSubjectValidator.validate({
        id: request.param('id'),
      })
      await this.subjectRepo.delete(body.id)
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
