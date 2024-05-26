import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_plan_comment'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('text').defaultTo('')
      table.integer('user_id').unsigned().index().references('id').inTable('user')
      table.integer('lesson_plan_id').unsigned().index().references('id').inTable('lesson_plan')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
