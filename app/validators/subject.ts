import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createSubjectValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createSubjectValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editSubjectValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75).trim(),
  })
)
editSubjectValidator.errorReporter = () => new JSONAPIErrorReporter()

export const deleteSubjectValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deleteSubjectValidator.errorReporter = () => new JSONAPIErrorReporter()
