import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import LoginCredential from './login_credential.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  static table = 'user'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'given_name' })
  declare givenName: string
  @column({ columnName: 'middle_name' })
  declare middleName: string
  @column({ columnName: 'surname' })
  declare surname: string
  @column.date()
  declare dateOfBirth: DateTime
  @column()
  declare address: string
  @column({ columnName: 'login_credential_id' })
  declare loginCredentialId: number
  @hasOne(() => LoginCredential, { foreignKey: 'id' })
  declare loginCredential: HasOne<typeof LoginCredential>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
