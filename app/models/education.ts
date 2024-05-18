import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import EducationalAttainment from './educational_attainment.js'
import Faculty from './faculty.js'

export default class Education extends BaseModel {
  static table = 'faculty_education'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'alma_mater' })
  declare almaMater: string
  @column({ columnName: 'educational_attainment_id' })
  declare educationalAttainmentId: number
  @hasOne(() => EducationalAttainment, { foreignKey: 'id' })
  declare educationalAttainment: HasOne<typeof EducationalAttainment>
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @belongsTo(() => Faculty, { foreignKey: 'id' })
  declare faculty: BelongsTo<typeof Faculty>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
