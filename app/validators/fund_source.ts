import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createFundSourceValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createFundSourceValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editFundSourceValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75).trim(),
  })
)
editFundSourceValidator.errorReporter = () => new JSONAPIErrorReporter()

export const deleteFundSourceValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deleteFundSourceValidator.errorReporter = () => new JSONAPIErrorReporter()
