import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
    from: vine.date(),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    status: vine.enum(['approved', 'unapproved']),
  })
)
createEventValidator.errorReporter = () => new JSONAPIErrorReporter()
