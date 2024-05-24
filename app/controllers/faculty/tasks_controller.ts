import { TaskRepository } from '#repositories/task_repository'
import { CloudinaryService } from '#services/cloudinary_service'
import { idValidator } from '#validators/task'
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
    protected logger: Logger
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
      task.fileAttachments.forEach((fa) => {
        const url = this.cloudinaryService.generatePublicUrlAsAttachment(fa.objectName)
        attachments.push(url)
      })

      return response.json({
        status: StatusCodes.OK,
        message: 'Task attachments fetched.',
        attachments,
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
