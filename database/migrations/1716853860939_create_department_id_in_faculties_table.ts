import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'faculty'

  async up() {
    this.schema.alterTable(this.tableName, (b) => {
      b.integer('department_id')
        .nullable()
        .unsigned()
        .index()
        .references('id')
        .inTable(this.tableName)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (b) => {
      b.dropColumn('department_id')
    })
  }
}
