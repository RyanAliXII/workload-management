import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Faculty from './faculty.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'name' })
  declare name: string
  @column.date({ columnName: 'from' })
  declare from: DateTime
  @column.date({ columnName: 'to' })
  declare to: DateTime
  @column({ columnName: 'location' })
  declare location: string
  @column({ columnName: 'description' })
  declare description: string
  @column({ columnName: 'status' })
  declare status: 'approved' | 'unapproved'
  @manyToMany(() => Faculty, {
    localKey: 'id',
    pivotTable: 'event_facilitator',
    pivotForeignKey: 'event_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'faculty_id',
  })
  declare facilitators: ManyToMany<typeof Faculty>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
