import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LoginCredential extends BaseModel {
  static table = 'login_credential'
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare email: string
  @column({ serializeAs: null })
  declare password: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
