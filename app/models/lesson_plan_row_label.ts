import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LessonPlanRowLabel extends BaseModel {
  static table = 'lesson_plan_row_label'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'label' })
  declare name: string
  @column({ columnName: 'lesson_plan_id' })
  declare lessonPlanId: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
