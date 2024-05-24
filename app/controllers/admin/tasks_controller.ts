// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { CloudinaryService } from '#services/cloudinary_service'
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
    protected logger: Logger,
    protected cloudinaryService: CloudinaryService
  ) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    return view.render('admin/tasks/index', {
      activeFaculty,
    })
  }

  async uploadTaskAttachments({ request, response }: HttpContext) {
    try {
      const files = request.files('attachments')

      if (files.length === 0) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'No files uploaded.',
        })
      }

      for (const f of files) {
        if (!f) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: 'No file uploaded.',
          })
        }
        if (!f.isValid) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: 'Validation error',
            errors: f?.errors,
          })
        }
        if (!f?.tmpPath) {
          this.logger.error('file no temp path')
          return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unknown error occurred.',
          })
        }
        const publicId = await this.cloudinaryService.upload({
          filePath: f.tmpPath,
          folder: 'task-attachments',
        })
      }

      return response.json({
        status: StatusCodes.OK,
        message: 'Files uploaded.',
      })
    } catch (error) {
      this.logger.error(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred.',
      })
    }
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
