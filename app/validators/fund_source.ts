import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createFundSourceValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createFundSourceValidator.errorReporter = () => new JSONAPIErrorReporter()
