import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'faculty'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employment_status')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('employment_status', [
        'regular',
        'part-time',
        'resigned',
        'terminated',
        'contractual',
        'substitute',
      ])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('employment_status')
    })
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('employment_status', ['regular', 'part-time', 'resigned', 'terminated'])
    })
  }
}
