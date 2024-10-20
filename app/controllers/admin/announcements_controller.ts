import { AnnouncementRepository } from '#repositories/announcement_repository'
import { BASE_URL, CloudinaryService } from '#services/cloudinary_service'
import { createAnnouncementValidator, editAnnouncementValidator } from '#validators/announcement'
import { idValidator } from '#validators/task'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'

import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class AnnouncementsController {
  constructor(
    protected logger: Logger,
    protected announcementRepo: AnnouncementRepository,
    protected cloudinary: CloudinaryService
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/announcements/index')
  }
  async getAll({ response }: HttpContext) {
    const announcements = await this.announcementRepo.getAll()

    return response.json({
      status: StatusCodes.OK,
      message: 'Announcements fetched',
      announcements,
      baseUrl: BASE_URL,
    })
  }
  async create({ request, response }: HttpContext) {
    try {
      const body = await createAnnouncementValidator.validate(request.body())
      const announcement = await this.announcementRepo.create(body)
      return response.json({
        status: StatusCodes.OK,
        message: 'Announcement created.',
        announcement,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
  async uploadThumbnail({ request, response }: HttpContext) {
    try {
      const file = await request.file('thumbnail')
      if (!file || !file.tmpPath) {
        return response.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST })
      }
      const AllowedExtNames = ['jpg', 'png', 'jpeg', 'webp']
      if (!AllowedExtNames.includes(file?.extname ?? '')) {
        return response.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST })
      }
      const result = await this.cloudinary.upload({
        filePath: file.tmpPath,
        folder: 'thumbnail',
        fileExtension: file.extname,
        resourceType: 'image',
      })
      return response.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Image uploaded.',
        key: result,
      })
    } catch (error) {
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
  async edit({ request, response }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const data = await editAnnouncementValidator.validate(body)
      const announcement = await this.announcementRepo.update(data)

      return response.json({
        status: StatusCodes.OK,
        message: 'Announcement updated.',
        announcement,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
  async delete({ request, response }: HttpContext) {
    try {
      const data = await idValidator.validate({ id: request.param('id') })
      await this.announcementRepo.delete(data.id)

      return response.json({
        status: StatusCodes.OK,
        message: 'Announcement deleted.',
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: error.messages,
        })
      }
      this.logger.info(error)
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occured.',
      })
    }
  }
}
