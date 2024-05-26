import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'

import Event from './event.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class EventFacilitator extends BaseModel {
  static table = 'event_facilitator'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'event_id' })
  declare eventId: number
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @belongsTo(() => Event, { foreignKey: 'eventId', localKey: 'id' })
  declare event: BelongsTo<typeof Event>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
