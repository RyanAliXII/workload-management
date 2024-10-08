import { errors } from '@vinejs/vine'
import { FieldContext, ErrorReporterContract } from '@vinejs/vine/types'

export class JSONAPIErrorReporter implements ErrorReporterContract {
  /**
   * A flag to know if one or more errors have been
   * reported
   */
  hasErrors: boolean = false

  /**
   * A collection of errors. Feel free to give accurate types
   * to this property
   */
  errors: Record<string, string[]> = {}

  /**
   * VineJS call the report method
   */
  report(message: string, _: string, field: FieldContext) {
    this.hasErrors = true

    const key = field.wildCardPath
    if (key in errors) {
      this.errors[key].push(message)
      return
    }
    this.errors[key] = [message]
  }

  /**
   * Creates and returns an instance of the
   * ValidationError class
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors)
  }
}
