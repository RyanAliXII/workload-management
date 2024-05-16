import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'faculty_education'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('faculty_id').unsigned().index().references('id').inTable('faculty')
      table.string('alma_mater')
      table
        .integer('educational_attainment_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('educational_attainment')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
