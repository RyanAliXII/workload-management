import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Faculty from './faculty.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

export default class Event extends compose(BaseModel, SoftDeletes) {
  static table = 'event'
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
    pivotTable: 'event_facilitator',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'faculty_id',
  })
  declare facilitators: ManyToMany<typeof Faculty>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
