import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EventFacilitator extends BaseModel {
  static table = 'event_facilitator'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'event_id' })
  declare eventId: number
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
