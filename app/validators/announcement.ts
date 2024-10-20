import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createAnnouncementValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    content: vine.string().trim(),
    thumbnail: vine.string().optional(),
  })
)
createAnnouncementValidator.errorReporter = () => new JSONAPIErrorReporter()
export const editAnnouncementValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    title: vine.string().trim(),
    content: vine.string().trim(),
    thumbnail: vine.string().optional(),
  })
)
editAnnouncementValidator.errorReporter = () => new JSONAPIErrorReporter()
export const idValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
