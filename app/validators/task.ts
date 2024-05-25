import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createTaskValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75),
    description: vine.string(),
    facultyId: vine.number().min(1),
  })
)

createTaskValidator.errorReporter = () => new JSONAPIErrorReporter()
createTaskValidator.messagesProvider = new SimpleMessagesProvider({
  'facultyId.min': 'Faculty is required',
})

export const attachmentUploadValidator = vine.compile(
  vine.object({
    taskId: vine.number().min(1),
  })
)
attachmentUploadValidator.messagesProvider = new SimpleMessagesProvider({
  'facultyId.min': 'Faculty is required',
})

export const editTaskValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(75),
    description: vine.string(),
    facultyId: vine.number().min(1),
  })
)
editTaskValidator.errorReporter = () => new JSONAPIErrorReporter()

export const deleteTaskValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deleteTaskValidator.errorReporter = () => new JSONAPIErrorReporter()

export const idValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
idValidator.errorReporter = () => new JSONAPIErrorReporter()

export const completionValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    remarks: vine.string().optional(),
  })
)
completionValidator.errorReporter = () => new JSONAPIErrorReporter()
