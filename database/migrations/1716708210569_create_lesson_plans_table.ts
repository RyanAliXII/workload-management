import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_plan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 75),
        table.enum('grade', [
          'grade-1',
          'grade-2',
          'grade-3',
          'grade-4',
          'grade-5',
          'grade-6',
          'grade-7',
          'grade-8',
          'grade-9',
          'grade-10',
          'grade-11',
          'grade-12',
        ])
      table.enum('quarter', ['quarter-1', 'quarter-2', 'quarter-3', 'quarter-4'])
      table.integer('week_number')
      table.date('start_date')
      table.date('end_date')
      table.integer('faculty_id').unsigned().index().references('id').inTable('faculty')
      table.text('learning_areas').defaultTo('')
      table.text('objective').defaultTo('')
      table.text('content_standard').defaultTo('')
      table.text('performance_standard').defaultTo('')
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
