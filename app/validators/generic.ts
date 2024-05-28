import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'
export const genericIdValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
genericIdValidator.errorReporter = () => new JSONAPIErrorReporter()
