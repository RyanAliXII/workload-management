import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

export default class Announcement extends compose(BaseModel, SoftDeletes) {
  static table = 'announcement'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'title' })
  declare title: string
  @column({ columnName: 'content' })
  declare content: string
  @column({ columnName: 'thumbnail' })
  declare thumbnail: string | null
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
