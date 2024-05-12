import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createDepartmentValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75).trim(),
  })
)
createDepartmentValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editDepartmentValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75).trim(),
  })
)
editDepartmentValidator.errorReporter = () => new JSONAPIErrorReporter()
export const deleteDepartmentValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deleteDepartmentValidator.errorReporter = () => new JSONAPIErrorReporter()
