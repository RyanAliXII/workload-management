import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LessonPlanSessionValue extends BaseModel {
  static table = 'lesson_plan_session_value'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'session_id' })
  declare sessionId: number
  @column({ columnName: 'text' })
  declare text: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
