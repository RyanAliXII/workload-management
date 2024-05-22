import { AddEvent, EditEvent } from '#types/event'
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
      eventModel.createdById = event.createdById ?? null
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
    return Event.query()
      .preload('facilitators', (builder) => {
        builder.preload('loginCredential')
      })
      .preload('createdBy')
      .whereBetween('from', [from, to])
  }
  async update(event: EditEvent) {
    const trx = await db.transaction()
    try {
      const dbEvent = await Event.findBy('id', event.id)
      if (!dbEvent) return
      dbEvent.useTransaction(trx)
      dbEvent.name = event.name
      dbEvent.from = DateTime.fromJSDate(event.from)
      dbEvent.to = DateTime.fromJSDate(event.to)
      dbEvent.description = event.description ?? ''
      dbEvent.location = event.location
      dbEvent.description = event.description ?? ''
      dbEvent.status = event.status
      dbEvent.save()
      await EventFacilitator.query({ client: trx }).where('event_id', dbEvent.id).delete()
      await EventFacilitator.createMany(
        event.facilitatorIds.map((id) => ({ facultyId: id, eventId: dbEvent.id })),
        { client: trx }
      )
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
  async delete(id: number) {
    const event = await Event.findBy('id', id)
    if (!event) return
    await event.delete()
  }
}
