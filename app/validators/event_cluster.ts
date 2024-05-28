import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

const messageProvider = new SimpleMessagesProvider({
  'departmentId.required': 'Department is required',
  'departmentId.min': 'Department is required',
})
export const createEventClusterValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
    from: vine.date(),
    departmentId: vine.number().min(1),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    createdById: vine.number().optional(),
  })
)
createEventClusterValidator.errorReporter = () => new JSONAPIErrorReporter()
createEventClusterValidator.messagesProvider = messageProvider

export const editEventClusterValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(100),
    from: vine.date(),
    departmentId: vine.number().min(1),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    createdById: vine.number().optional(),
  })
)
editEventClusterValidator.errorReporter = () => new JSONAPIErrorReporter()
editEventClusterValidator.messagesProvider = messageProvider
