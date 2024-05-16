import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

const createFacultyValidator = vine.compile(
  vine.object({
    givenName: vine.string().maxLength(100),
    middleName: vine.string().maxLength(100),
    surname: vine.string().maxLength(100),
    dateOfBirth: vine.string(),
    image: vine.string().optional(),
    TIN: vine.string().maxLength(100).optional(),
    positionId: vine.number().min(1),
    employmentStatus: vine.enum(['regular, part-time', 'resigned', 'terminated']),
    fundSourceId: vine.number().min(1),
    mobileNumber: vine.string().mobile({ locale: ['en-PH'] }),
    educations: vine
      .array(
        vine.object({
          almaMater: vine.string(),
          educationalAttainmentId: vine.number().min(1),
        })
      )
      .minLength(1),
  })
)
createFacultyValidator.errorReporter = () => new JSONAPIErrorReporter()
