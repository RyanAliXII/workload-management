import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EventCluster from './event_cluster.js'

export default class EventClusterFacilitator extends BaseModel {
  static table = 'event_cluster_facilitator'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'event_cluster_id' })
  declare eventClusterId: number
  @column({ columnName: 'faculty_id' })
  declare facultyId: number
  @belongsTo(() => EventCluster, { foreignKey: 'eventClusterId', localKey: 'id' })
  declare event: BelongsTo<typeof EventCluster>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
