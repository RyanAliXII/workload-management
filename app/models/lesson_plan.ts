import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import LessonPlanSession from './lesson_plan_session.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import LessonPlanRowLabel from './lesson_plan_row_label.js'

export default class LessonPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'name' })
  declare name: string
  @column({ columnName: 'grade' })
  declare grade: string
  @column({ columnName: 'quarter' })
  declare quarter: string
  @column({ columnName: 'week_number' })
  declare weekNumber: number
  @column.date({ columnName: 'start_date' })
  declare startDate: DateTime
  @column.date({ columnName: 'end_date' })
  declare endDate: DateTime
  @column({ columnName: 'learning_areas' })
  declare learningAreas: string
  @column({ columnName: 'objective' })
  declare objective: string
  @column({ columnName: 'content_standard' })
  declare contentStandard: string
  @column({ columnName: 'performance_standard' })
  declare performanceStandard: string
  @hasMany(() => LessonPlanSession, { foreignKey: 'lessonPlanId', localKey: 'id' })
  declare sessions: HasMany<typeof LessonPlanSession>
  @hasMany(() => LessonPlanRowLabel, { foreignKey: 'lessonPlanId', localKey: 'id' })
  declare rowLabels: HasMany<typeof LessonPlanRowLabel>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
