import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createTaskValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(75),
    description: vine.string(),
    fileAttachments: vine.array(vine.string()).optional(),
    facultyId: vine.number().min(1),
  })
)

createTaskValidator.errorReporter = () => new JSONAPIErrorReporter()
createTaskValidator.messagesProvider = new SimpleMessagesProvider({
  'facultyId.min': 'Faculty is required',
})
