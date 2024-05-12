import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75),
  })
)
createDepartmentValidator.errorReporter = () => new JSONAPIErrorReporter()
