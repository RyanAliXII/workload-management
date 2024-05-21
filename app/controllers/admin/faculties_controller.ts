import { EducationalAttainmentRepository } from '#repositories/educational_attainment_repository'
import { FundSourceRepository } from '#repositories/fund_source_respository'
import { PositionRepository } from '#repositories/position_repository'
import { BASE_URL, CloudinaryService } from '#services/cloudinary_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
import {
  createFacultyValidator,
  editFacultyPageValidator,
  editFacultyValidator,
  imageUploadValidator,
} from '#validators/faculty'
import { FacultyRepository } from '#repositories/faculty_repository'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class FacultiesController {
  constructor(
    protected positionRepo: PositionRepository,
    protected fundSourceRepo: FundSourceRepository,
    protected educationalAttainmentRepo: EducationalAttainmentRepository,
    protected cloudinaryService: CloudinaryService,
    protected logger: Logger,
    protected facultyRepo: FacultyRepository
  ) {}
  async index({ view, request }: HttpContext) {
    const faculties = await this.facultyRepo.getAll()
    return view.render('admin/faculties/index', {
      faculties: faculties ?? [],
    })
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
      const data = await imageUploadValidator.validate({ facultyId: request.input('facultyId') })
      const publicId = await this.cloudinaryService.upload({
        filePath: file.tmpPath,
        folder: 'faculty-images',
      })
      const faculty = await this.facultyRepo.updateFacultyImage(data.facultyId, publicId)
      return response.json({
        status: StatusCodes.OK,
        message: 'File uploaded.',
        faculty,
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
      const faculty = await this.facultyRepo.create(body)
      return response.json({
        status: StatusCodes.OK,
        message: 'faculty added.',
        faculty,
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
  async editPage({ request, response, view }: HttpContext) {
    try {
      const id = request.param('id')
      const data = await editFacultyPageValidator.validate({ id })
      const faculty = await this.facultyRepo.findById(data.id)
      if (!faculty) {
        return response.status(StatusCodes.NOT_FOUND).send('Not found.')
      }

      const positions = await this.positionRepo.getAll()
      const fundSources = await this.fundSourceRepo.getAll()
      const educationalAttainments = await this.educationalAttainmentRepo.getAll()
      return view.render('admin/faculties/edit-faculty', {
        faculty,
        positions,
        fundSources,
        educationalAttainments,
        assetBaseUrl: BASE_URL,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(StatusCodes.NOT_FOUND).send('Not found.')
      }
      this.logger.error(error)
      return response.abort('Unknown errror occured.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
  async edit({ request, response }: HttpContext) {
    try {
      const id = request.param('id')
      const body = await request.body()
      body.id = id
      const data = await editFacultyValidator.validate(body)
      if (data.password) {
        data.password = await hash.make(data.password)
      }
      const faculty = await this.facultyRepo.update(data)
      return response.json({
        status: StatusCodes.OK,
        message: 'Faculty updated.',
        faculty: faculty,
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
      return response.abort('Unknown errror occured.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
