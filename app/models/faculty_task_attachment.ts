import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FacultyTaskAttachment extends BaseModel {
  static table = 'faculty_task_attachment'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'task_id' })
  declare taskId: number
  @column({ columnName: 'object_name' })
  declare objectName: string
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
