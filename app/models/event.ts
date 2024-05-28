import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import Faculty from './faculty.js'

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
  @column({ columnName: 'created_by_id' })
  declare createdById: number | null
  @column({ columnName: 'is_public', serialize: Boolean })
  declare isPublic: boolean
  @belongsTo(() => Faculty, { foreignKey: 'createdById', localKey: 'id' })
  declare createdBy: BelongsTo<typeof Faculty>
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
