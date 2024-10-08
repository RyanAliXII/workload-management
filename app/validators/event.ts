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
    createdById: vine.number().optional(),
    status: vine.enum(['approved', 'unapproved']),
    isPublic: vine.boolean(),
  })
)
createEventValidator.errorReporter = () => new JSONAPIErrorReporter()

export const eventByRangeValidator = vine.compile(
  vine.object({
    from: vine.date(),
    to: vine.date().afterOrSameAs('from'),
  })
)
createEventValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editEventValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(100),
    from: vine.date(),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    status: vine.enum(['approved', 'unapproved']),
    isPublic: vine.boolean(),
  })
)
editEventValidator.errorReporter = () => new JSONAPIErrorReporter()

export const deleteEventValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
deleteEventValidator.errorReporter = () => new JSONAPIErrorReporter()

export const createEventFacultyValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
    from: vine.date(),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    isPublic: vine.boolean(),
  })
)
createEventFacultyValidator.errorReporter = () => new JSONAPIErrorReporter()

export const editEventFacultyValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    name: vine.string().maxLength(100),
    from: vine.date(),
    to: vine.date().afterOrSameAs('from'),
    facilitatorIds: vine.array(vine.number().min(1)),
    location: vine.string(),
    description: vine.string().optional(),
    isPublic: vine.boolean(),
  })
)
editEventFacultyValidator.errorReporter = () => new JSONAPIErrorReporter()
