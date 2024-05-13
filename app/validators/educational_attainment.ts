import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createEducationalAttainmentValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createEducationalAttainmentValidator.errorReporter = () => new JSONAPIErrorReporter()
