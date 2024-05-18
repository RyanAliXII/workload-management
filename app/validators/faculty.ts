import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { JSONAPIErrorReporter } from './json_api_error_reporter.js'

const facultyMessageProvider = new SimpleMessagesProvider({
  'givenName.required': 'Given name is required',
  'givenName.maxLength': 'Given name cannot exceed 100 characters',
  'middleName.required': 'Middle name is required',
  'middleName.maxLength': 'Middle name name cannot exceed 100 characters',
  'surname.required': 'Surname is required',
  'surname.maxLength': 'Surname cannot exceed 100 characters',
  'dateOfBirth.required': 'Date of birth is required',
  'gender.required': 'Gender is required',
  'gender.enum': 'Please select a gender',
  'positionId.required': 'Position is required',
  'positionId.min': 'Position is required',
  'employmentStatus.required': 'Employment status is required',
  'fundSourceId.required': 'Fund source is required',
  'fundSourceId.min': 'Fund source is required',
  'educations.*.almaMater.required': 'Alma mater is required',
  'educations.*.educationalAttainmentId.min': 'Educational attainment is required',
  'email.required': 'Email is required',
  'mobileNumber.required': 'Mobile numer is required.',
  'password.required': 'Password is required',
})
export const createFacultyValidator = vine.compile(
  vine.object({
    givenName: vine.string().maxLength(100),
    middleName: vine.string().maxLength(100),
    surname: vine.string().maxLength(100),
    dateOfBirth: vine.date(),
    gender: vine.enum(['male', 'female', 'other']),
    image: vine.string().optional(),
    tin: vine.string().maxLength(100).optional(),
    positionId: vine.number().min(1),
    employmentStatus: vine.enum(['regular', 'part-time', 'resigned', 'terminated']),
    fundSourceId: vine.number().min(1),
    email: vine.string().email(),

    mobileNumber: vine.string().mobile({ locale: ['en-PH'] }),
    password: vine.string().minLength(10),
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
createFacultyValidator.messagesProvider = facultyMessageProvider

export const editFacultyPageValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
editFacultyPageValidator.errorReporter = () => new JSONAPIErrorReporter()
editFacultyPageValidator.messagesProvider = facultyMessageProvider

export const editFacultyValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
    givenName: vine.string().maxLength(100),
    middleName: vine.string().maxLength(100),
    surname: vine.string().maxLength(100),
    dateOfBirth: vine.date(),
    gender: vine.enum(['male', 'female', 'other']),
    image: vine.string().optional(),
    tin: vine.string().maxLength(100).optional(),
    positionId: vine.number().min(1),
    employmentStatus: vine.enum(['regular', 'part-time', 'resigned', 'terminated']),
    fundSourceId: vine.number().min(1),
    email: vine.string().email(),

    mobileNumber: vine.string().mobile({ locale: ['en-PH'] }),
    password: vine.string().maxLength(10).optional().requiredIfExists('password'),
    educations: vine
      .array(
        vine.object({
          id: vine.number().optional(),
          facultyId: vine.number().optional(),
          almaMater: vine.string(),
          educationalAttainmentId: vine.number().min(1),
        })
      )
      .minLength(1),
  })
)
editFacultyValidator.errorReporter = () => new JSONAPIErrorReporter()
editFacultyValidator.messagesProvider = facultyMessageProvider
