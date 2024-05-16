import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'faculty'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('given_name', 75)
      table.string('middle_name', 75)
      table.string('surname', 75)
      table.enum('gender', ['male', 'female', 'other'])
      table.date('date_of_birth')
      table.string('TIN', 100)
      table.string('image')
      table.integer('position_id').unsigned().index().references('id').inTable('position')
      table.enum('employment_status', ['regular', 'part-time', 'resigned', 'terminated'])
      table.integer('fund_source_id').unsigned().index().references('id').inTable('fund_source')
      table
        .integer('login_credential_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('login_credential')
      table.string('mobile_number', 30)
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
