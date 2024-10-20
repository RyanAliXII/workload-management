import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_announcement_thumbnail_columns'

  async up() {
    this.schema.alterTable('announcement', (table) => {
      table.string('thumbnail').nullable()
    })
  }

  async down() {
    this.schema.alterTable('announcement', (table) => {
      table.dropColumn('thumbnail')
    })
  }
}
