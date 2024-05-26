import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import LessonPlanSessionValue from './lesson_plan_session_value.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class LessonPlanSession extends BaseModel {
  static table = 'lesson_plan_session'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'lesson_plan_id' })
  declare lessonPlanId: number
  @hasMany(() => LessonPlanSessionValue, { foreignKey: 'sessionId', localKey: 'id' })
  declare values: HasMany<typeof LessonPlanSessionValue>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
