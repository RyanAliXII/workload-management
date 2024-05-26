import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class LessonPlanComment extends BaseModel {
  static table = 'lesson_plan_comment'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'text' })
  declare text: string
  @column({ columnName: 'user_id' })
  declare userId: number
  @column({ columnName: 'lesson_plan_id' })
  declare lessonPlanId: number
  @hasOne(() => User, { foreignKey: 'id', localKey: 'userId' })
  declare user: HasOne<typeof User>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
