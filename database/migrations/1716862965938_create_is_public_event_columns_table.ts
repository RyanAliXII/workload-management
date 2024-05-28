import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event'

  async up() {
    this.schema.alterTable(this.tableName, (b) => {
      b.boolean('is_public').defaultTo('false')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (b) => {
      b.dropColumn('is_public')
    })
  }
}
