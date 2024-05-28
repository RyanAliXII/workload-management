import EventCluster from '#models/event_cluster'
import EventClusterFacilitator from '#models/event_cluster_facilitator'

import { AddEventCluster, EditEventCluster } from '#types/event_cluster'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
inject()
export class EventClusterRepository {
  async create(event: AddEventCluster) {
    const trx = await db.transaction()
    try {
      const eventModel = new EventCluster()
      eventModel.useTransaction(trx)
      eventModel.name = event.name
      eventModel.from = DateTime.fromJSDate(event.from)
      eventModel.to = DateTime.fromJSDate(event.to)
      eventModel.description = event.description ?? ''
      eventModel.location = event.location
      eventModel.description = event.description ?? ''

      eventModel.createdById = event.createdById ?? null
      eventModel.departmentId = event.departmentId
      await eventModel.save()
      const facilitator = new EventClusterFacilitator()
      facilitator.useTransaction(trx)
      for (const id of event.facilitatorIds) {
        facilitator.eventClusterId = eventModel.id
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
    return EventCluster.query()
      .preload('facilitators', (builder) => {
        builder.preload('loginCredential')
      })
      .preload('department')
      .whereBetween('from', [from, to])
  }
  async getWithinRangeAndDepartment(from: Date, to: Date, departmentId: number) {
    return EventCluster.query()
      .preload('facilitators', (builder) => {
        builder.preload('loginCredential')
      })
      .preload('department')
      .andWhere((b) => {
        b.whereBetween('from', [from, to])
        b.where('department_id', departmentId)
      })
  }
  async update(event: EditEventCluster) {
    const trx = await db.transaction()
    try {
      const dbEvent = await EventCluster.findBy('id', event.id)
      if (!dbEvent) return
      dbEvent.useTransaction(trx)
      dbEvent.name = event.name
      dbEvent.from = DateTime.fromJSDate(event.from)
      dbEvent.to = DateTime.fromJSDate(event.to)
      dbEvent.description = event.description ?? ''
      dbEvent.location = event.location
      dbEvent.description = event.description ?? ''
      dbEvent.departmentId = event.departmentId
      dbEvent.save()
      await EventClusterFacilitator.query({ client: trx })
        .where('event_cluster_id', dbEvent.id)
        .delete()
      await EventClusterFacilitator.createMany(
        event.facilitatorIds.map((id) => ({ facultyId: id, eventClusterId: dbEvent.id })),
        { client: trx }
      )
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
  async delete(id: number) {
    const event = await EventCluster.findBy('id', id)
    if (!event) return
    await event.delete()
  }
}
