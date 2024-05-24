// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { TaskAttachmentRepository } from '#repositories/task_attachment_repository'
import { TaskRepository } from '#repositories/task_repository'
import { BASE_URL, CloudinaryService } from '#services/cloudinary_service'
import { attachmentUploadValidator, createTaskValidator, editTaskValidator } from '#validators/task'
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
    protected cloudinaryService: CloudinaryService,
    protected taskRepo: TaskRepository,
    protected taskAttachmentRepo: TaskAttachmentRepository
  ) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    const tasks = await this.taskRepo.getAll()

    return view.render('admin/tasks/index', {
      activeFaculty,
      tasks: JSON.stringify(tasks),
      assetBaseUrl: BASE_URL,
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
      const data = await attachmentUploadValidator.validate({
        taskId: request.input('taskId'),
      })
      const attachments = []
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
          fileExtension: f.extname,
        })

        attachments.push({
          taskId: data.taskId,
          objectName: publicId,
        })
      }
      const fileAttachments = await this.taskAttachmentRepo.createOrUpdateMany(attachments)
      return response.json({
        status: StatusCodes.OK,
        message: 'Files uploaded.',
        attachments: fileAttachments,
      })
    } catch (error) {
      this.logger.error(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred.',
      })
    }
  }
  async create({ request, response, auth }: HttpContext) {
    try {
      const body = await createTaskValidator.validate(request.body())
      if (!auth.user?.id) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Unauthorized',
        })
      }
      const data = { ...body, assignedById: auth.user.id }
      const task = await this.taskRepo.create(data)

      return response.json({
        status: StatusCodes.OK,
        message: 'Task added.',
        task,
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
  async edit({ request, response, auth }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const validatedBody = await editTaskValidator.validate(body)
      if (!auth.user?.id) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Unauthorized',
        })
      }
      const data = { ...validatedBody, assignedById: auth.user.id }
      const task = await this.taskRepo.update(data)

      return response.json({
        status: StatusCodes.OK,
        message: 'Task updated.',
        task,
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
