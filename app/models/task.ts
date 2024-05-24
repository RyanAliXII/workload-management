import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Faculty from './faculty.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import TaskAttachment from './task_attachment.js'

export default class Task extends BaseModel {
  static table = 'task'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'name' })
  declare name: string
  @column({ columnName: 'description' })
  declare description: string
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @column({ columnName: 'assigned_by_id' })
  declare assignedById: number
  @hasOne(() => Faculty, { foreignKey: 'id', localKey: 'facultyId' })
  declare faculty: HasOne<typeof Faculty>
  @hasOne(() => User, { foreignKey: 'id', localKey: 'assignedById' })
  declare assignedBy: HasOne<typeof User>
  @hasMany(() => TaskAttachment, { foreignKey: 'taskId', localKey: 'id' })
  declare fileAttachments: HasMany<typeof TaskAttachment>
  @column.dateTime()
  declare completedAt: DateTime | null
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
