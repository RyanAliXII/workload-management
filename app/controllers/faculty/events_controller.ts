import EventRepository from '#repositories/event_repository'
import { FacultyRepository } from '#repositories/faculty_repository'
import { AddEvent, EditEvent } from '#types/event'
import {
  createEventFacultyValidator,
  deleteEventValidator,
  editEventFacultyValidator,
  eventByRangeValidator,
} from '#validators/event'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

@inject()
export default class EventsController {
  constructor(
    protected logger: Logger,
    protected eventRepo: EventRepository,
    protected facultyRepo: FacultyRepository
  ) {}
  async index({ view, response, request }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    const contentType = request.header('content-type')
    if (contentType === 'application/json') {
      try {
        const query = await eventByRangeValidator.validate({
          from: request.input('from'),
          to: request.input('to'),
        })
        const events = await this.eventRepo.getWithinRange(query.from, query.to)
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
    return view.render('faculty/events/index', {
      activeFaculty: activeFaculty,
    })
  }
  async create({ request, response, auth }: HttpContext) {
    try {
      const data = await createEventFacultyValidator.validate(request.body())
      const event: AddEvent = {
        ...data,
        status: 'unapproved',
        createdById: auth.user?.id,
      }
      await this.eventRepo.create(event)
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
        message: 'Unknown error occured',
      })
    }
  }
  async edit({ request, response }: HttpContext) {
    try {
      const body = request.body()
      body.id = request.param('id')
      const data = await editEventFacultyValidator.validate(body)
      const event: EditEvent = { ...data, status: 'unapproved' }
      await this.eventRepo.update(event)
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
      const data = await deleteEventValidator.validate({ id: request.param('id', 0) })
      await this.eventRepo.delete(data.id)
      return response.json({ status: StatusCodes.OK, message: 'Event deleted.' })
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
}
