import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuthFaculty extends BaseModel {
  static table = 'auth_faculty_view'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'given_name' })
  declare givenName: string
  @column({ columnName: 'middle_name' })
  declare middleName: string
  @column({ columnName: 'surname' })
  declare surname: string
  @column({ columnName: 'email' })
  declare email: string
  @column({ columnName: 'password' })
  declare password: string
}
