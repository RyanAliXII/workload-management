import { FacultyTaskAttachmentRepository } from '#repositories/faculty_task_attachment_repository'
import { TaskRepository } from '#repositories/task_repository'
import { CloudinaryService } from '#services/cloudinary_service'
import { attachmentUploadValidator, completionValidator, idValidator } from '#validators/task'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class TasksController {
  constructor(
    protected taskRepo: TaskRepository,
    protected cloudinaryService: CloudinaryService,
    protected logger: Logger,
    protected facultyTaskAttachmentRepo: FacultyTaskAttachmentRepository
  ) {}
  async index({ view, auth, response, request }: HttpContext) {
    if (!auth.user?.id) {
      return response.abort('Unauthorized', StatusCodes.UNAUTHORIZED)
    }
    const contentType = request.header('content-type')
    if (contentType === 'application/json') {
      const status = request.input('status')
      const tasks = await this.taskRepo.getByStatusAndFacultyId(status, auth.user.id)
      return response.json({
        status: StatusCodes.OK,
        message: 'Tasks fetched.',
        tasks,
      })
    }
    const tasks = await this.taskRepo.getByFacultyId(auth.user.id)
    return view.render('faculty/tasks/index', {
      tasks: JSON.stringify(tasks),
    })
  }
  async getAttachmentByTaskId({ request, response }: HttpContext) {
    try {
      const data = await idValidator.validate({ id: request.param('id') })
      const task = await this.taskRepo.getOne(data.id)
      if (!task) {
        return response.json({
          status: StatusCodes.NOT_FOUND,
          message: 'Task not found.',
        })
      }
      const attachments: string[] = []
      const facultyAttachments: string[] = []
      for (const attachment of task.fileAttachments) {
        const url = this.cloudinaryService.generatePublicUrlAsAttachment(attachment.objectName)
        attachments.push(url)
      }
      for (const attachment of task.facultyAttachments) {
        const url = this.cloudinaryService.generatePublicUrlAsAttachment(attachment.objectName)
        facultyAttachments.push(url)
      }
      return response.json({
        status: StatusCodes.OK,
        message: 'Task attachments fetched.',
        attachments,
        facultyAttachments,
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
          resourceType: 'auto',
        })

        attachments.push({
          taskId: data.taskId,
          objectName: publicId,
        })
      }
      const fileAttachments = await this.facultyTaskAttachmentRepo.createOrUpdateMany(attachments)
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
  async updateCompletion({ request, response, auth }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const data = await completionValidator.validate(request.body())
      if (!auth.user?.id) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Unauthorized',
        })
      }

      const task = await this.taskRepo.markAsComplete(data)
      return response.json({
        status: StatusCodes.OK,
        message: 'Task completed.',
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
