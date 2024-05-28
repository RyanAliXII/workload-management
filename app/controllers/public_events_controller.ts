import EventRepository from '#repositories/event_repository'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { StatusCodes } from 'http-status-codes'
@inject()
export default class PublicEventsController {
  constructor(protected eventRepo: EventRepository) {}
  async index({ view }: HttpContext) {
    return view.render('events')
  }
  async publicEvents({ response }: HttpContext) {
    const events = await this.eventRepo.getPublic()
    return response.json({
      status: StatusCodes.OK,
      events,
    })
  }
}
