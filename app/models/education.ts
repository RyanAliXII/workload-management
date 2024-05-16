import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import EducationalAttainment from './educational_attainment.js'

export default class Education extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'alma_mater' })
  declare almaMater: string
  @column({ columnName: 'education_attainment_id' })
  declare educationAttainmentId: number
  @hasOne(() => EducationalAttainment, { foreignKey: 'id' })
  declare educationalAttainment: HasOne<typeof EducationalAttainment>
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
