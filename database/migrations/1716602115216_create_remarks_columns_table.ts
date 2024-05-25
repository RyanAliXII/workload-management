import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task'

  async up() {
    this.schema.alterTable(this.tableName, (b) => {
      b.text('remarks').defaultTo('')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (b) => {
      b.dropColumn('remarks')
    })
  }
}
