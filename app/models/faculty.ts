import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import LoginCredential from './login_credential.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Position from './position.js'
import FundSource from './fund_source.js'
import Education from './education.js'

export default class Faculty extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'given_name' })
  declare givenName: string
  @column({ columnName: 'middle_name' })
  declare middleName: string
  @column({ columnName: 'surname' })
  declare surname: string
  @column({ columnName: 'gender' })
  declare gender: string
  @column({ columnName: 'date_of_birth' })
  declare dateOfBirth: DateTime
  @column({ columnName: 'TIN' })
  declare TIN: string
  @column({ columnName: 'position_id' })
  declare positionId: number
  @column({ columnName: 'employment_status' })
  declare employmentStatus: string
  @column({ columnName: 'fund_source_id' })
  declare fundSourceId: number
  @column({ columnName: 'login_credential_id' })
  declare loginCredentialId: number
  @column({ columnName: 'mobile_number' })
  declare mobileNumber: string

  @hasOne(() => Position, { foreignKey: 'id' })
  declare position: HasOne<typeof Position>

  @hasOne(() => FundSource, { foreignKey: 'id' })
  declare fundSource: HasOne<typeof FundSource>

  @hasOne(() => LoginCredential, { foreignKey: 'id' })
  declare loginCredential: HasOne<typeof LoginCredential>

  @hasMany(() => Education, { foreignKey: 'faculty_id' })
  declare educations: HasMany<typeof Education>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
