import { DepartmentRepository } from '#repositories/department_repository'
import { EventClusterRepository } from '#repositories/event_cluster_repository'
import { FacultyRepository } from '#repositories/faculty_repository'
import { eventByRangeValidator } from '#validators/event'
import { createEventClusterValidator, editEventClusterValidator } from '#validators/event_cluster'
import { genericIdValidator } from '#validators/generic'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class EventClustersController {
  constructor(
    protected logger: Logger,
    protected facultyRepo: FacultyRepository,
    protected departmentRepo: DepartmentRepository,
    protected eventClusterRepo: EventClusterRepository
  ) {}
  async index({ view, request, response }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    const departments = await this.departmentRepo.getAll()
    const contentType = request.header('content-type')
    if (contentType === 'application/json') {
      try {
        const query = await eventByRangeValidator.validate({
          from: request.input('from'),
          to: request.input('to'),
        })
        const events = await this.eventClusterRepo.getWithinRange(query.from, query.to)
        return response.json({
          status: StatusCodes.OK,
          message: 'events fetched',
          events,
        })
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
    return view.render('admin/event-clustering/index', {
      activeFaculty,
      departments,
    })
  }
  async getFacultyByDepartment({ request, response }: HttpContext) {
    try {
      const id = await request.param('departmentId')
      const data = await genericIdValidator.validate({ id: id })
      const faculty = await this.facultyRepo.findByDepartmentAndActive(data.id)
      return response.json({
        status: StatusCodes.OK,
        faculty,
      })
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
  async create({ request, response }: HttpContext) {
    try {
      const data = await createEventClusterValidator.validate(request.body())
      await this.eventClusterRepo.create(data)
      return response.json({
        status: StatusCodes.OK,
        message: 'Event created.',
      })
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
        message: error,
      })
    }
  }
  async edit({ request, response }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const data = await editEventClusterValidator.validate(body)
      await this.eventClusterRepo.update(data)
      return response.json({ status: StatusCodes.OK, message: 'Event updated.' })
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
  async delete({ request, response }: HttpContext) {
    try {
      const data = await genericIdValidator.validate({ id: request.param('id', 0) })
      await this.eventClusterRepo.delete(data.id)
      return response.json({ status: StatusCodes.OK, message: 'Event deleted.' })
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
