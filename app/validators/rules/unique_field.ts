import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
  ignore?: {
    column: string
    field: string
  }
}

/**
 * Implementation
 */
async function uniqueField(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }
  let row = null
  if (!options?.ignore) {
    row = await db
      .query()
      .select(options.column)
      .from(options.table)
      .where(options.column, value)
      .first()
  } else {
    row = await db
      .query()
      .select(options.column)
      .from(options.table)
      .andWhere((builder) => {
        builder.where(options.column, value)
        if (options?.ignore?.column && options?.ignore?.field) {
          builder.whereNot(options.ignore?.column, field.data[options.ignore.field])
        }
      })
      .first()
  }

  if (row) {
    field.report('The {{ field }} field is already used', 'uniqueField', field)
  }
}
export const uniqueFieldRule = vine.createRule(uniqueField)
