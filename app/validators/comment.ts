import vine from '@vinejs/vine'

import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

export const createCommentValidator = vine.compile(
  vine.object({
    text: vine.string().trim(),
    userId: vine.number(),
    lessonPlanId: vine.number(),
  })
)
createCommentValidator.errorReporter = () => new JSONAPIErrorReporter()
