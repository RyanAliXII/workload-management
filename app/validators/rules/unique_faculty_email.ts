import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
  ignore?: {
    column: string
    field: string
  }
}

async function uniqueFacultyEmail(value: unknown, options: Options = {}, field: FieldContext) {
  if (typeof value !== 'string') {
    return
  }
  let row = null

  if (!options.ignore) {
    row = await db
      .query()
      .select('email')
      .from('faculty')
      .where('email', value.toLowerCase())
      .innerJoin('login_credential', 'faculty.login_credential_id', 'login_credential.id')
      .limit(1)
      .first()
  } else {
    row = await db
      .query()
      .select('email')
      .from('faculty')
      .andWhere((builder) => {
        builder.where('email', value)
        if (options?.ignore?.column && options?.ignore.column) {
          builder.whereNot(options.ignore.column, field.data[options.ignore.field])
        }
      })
      .innerJoin('login_credential', 'faculty.login_credential_id', 'login_credential.id')
      .limit(1)
      .first()
  }

  if (row) {
    field.report('The {{ field }} field is already used', 'uniqueFacultyEmail', field)
  }
}

export const uniqueFacultyEmailRule = vine.createRule(uniqueFacultyEmail)
