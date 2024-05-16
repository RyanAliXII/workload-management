import { EducationalAttainmentRepository } from '#repositories/educational_attainment_repository'
import { FundSourceRepository } from '#repositories/fund_source_respository'
import { PositionRepository } from '#repositories/position_repository'
import { CloudinaryUploader } from '#services/cloudinary_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
import { createFacultyValidator } from '#validators/faculty'
import { FacultyRepository } from '#repositories/faculty_repository'
import hash from '@adonisjs/core/services/hash'
@inject()
export default class FacultiesController {
  constructor(
    protected positionRepo: PositionRepository,
    protected fundSourceRepo: FundSourceRepository,
    protected educationalAttainmentRepo: EducationalAttainmentRepository,
    protected cloudinaryUploader: CloudinaryUploader,
    protected logger: Logger,
    protected facultyRepo: FacultyRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/faculties/index')
  }
  async add({ view }: HttpContext) {
    const positions = await this.positionRepo.getAll()
    const fundSources = await this.fundSourceRepo.getAll()
    const educationalAttainments = await this.educationalAttainmentRepo.getAll()
    return view.render('admin/faculties/add-faculty', {
      positions,
      fundSources,
      educationalAttainments,
    })
  }
  async uploadFacultyImage({ request, response }: HttpContext) {
    try {
      const file = request.file('image', {
        size: '3mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
      })
      if (!file) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'No file uploaded.',
        })
      }
      if (!file.isValid) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          errors: file?.errors,
        })
      }

      if (!file?.tmpPath) {
        this.logger.error('file no temp path')
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Unknown error occurred.',
        })
      }
      const publicId = await this.cloudinaryUploader.upload({
        filePath: file.tmpPath,
        folder: 'faculty-images',
      })
      return response.json({
        status: StatusCodes.OK,
        message: 'File uploaded.',
        publicId,
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
      const body = await createFacultyValidator.validate(request.body())
      body.password = await hash.make(body.password)
      await this.facultyRepo.create(body)
      return response.json({
        status: StatusCodes.OK,
        message: 'faculty added.',
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation erro',
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
