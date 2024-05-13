import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createPositionValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createPositionValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editPositionValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75).trim(),
  })
)
editPositionValidator.errorReporter = () => new JSONAPIErrorReporter()

export const deletePositionValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deletePositionValidator.errorReporter = () => new JSONAPIErrorReporter()
