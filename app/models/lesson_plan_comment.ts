import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LessonPlanComment extends BaseModel {
  static table = 'lesson_plan_comment'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'text' })
  declare text: string
  @column({ columnName: 'user_id' })
  declare userId: number | null
  @column({ columnName: 'lesson_plan_id' })
  declare lessonPlanId: number
  @belongsTo(() => User, { foreignKey: 'userId', localKey: 'id' })
  declare user: BelongsTo<typeof User>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
