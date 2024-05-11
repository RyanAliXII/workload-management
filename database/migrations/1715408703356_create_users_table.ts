import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('given_name', 100)
      table.string('middle_name', 100)
      table.string('surname', 100)
      table.date('date_of_birth')
      table.text('address').defaultTo('')
      table
        .integer('login_credential_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('login_credential')
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
