import { AddEvent } from '#types/event'
import { inject } from '@adonisjs/core'
import Event from '#models/event'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import EventFacilitator from '#models/event_facilitator'
@inject()
export default class EventRepository {
  async create(event: AddEvent) {
    const trx = await db.transaction()
    try {
      const eventModel = new Event()
      eventModel.useTransaction(trx)
      eventModel.name = event.name
      eventModel.from = DateTime.fromJSDate(event.from)
      eventModel.to = DateTime.fromJSDate(event.to)
      eventModel.description = event.description ?? ''
      eventModel.location = event.location
      eventModel.description = event.description ?? ''
      eventModel.status = event.status
      await eventModel.save()
      const facilitator = new EventFacilitator()
      facilitator.useTransaction(trx)
      for (const id of event.facilitatorIds) {
        facilitator.eventId = eventModel.id
        facilitator.facultyId = id
        await facilitator.save()
      }
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
  async getWithinRange(from: Date, to: Date) {
    return Event.query().preload('facilitators').whereBetween('from', [from, to])
  }
}
