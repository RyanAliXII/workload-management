import { BaseModel, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Department from './department.js'
import Faculty from './faculty.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

export default class EventCluster extends compose(BaseModel, SoftDeletes) {
  static table = 'event_cluster'
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

  @column({ columnName: 'created_by_id' })
  declare createdById: number | null
  @column({ columnName: 'department_id' })
  declare departmentId: number
  @hasOne(() => Department, { foreignKey: 'id', localKey: 'departmentId' })
  declare department: HasOne<typeof Department>
  @manyToMany(() => Faculty, {
    pivotTable: 'event_cluster_facilitator',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'event_cluster_id',
    pivotRelatedForeignKey: 'faculty_id',
  })
  declare facilitators: ManyToMany<typeof Faculty>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
