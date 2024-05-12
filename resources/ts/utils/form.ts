import { set } from 'lodash'
type ErrorType = Record<number | string, string[]>

export const toStructuredErrors = (inputErrors: ErrorType) => {
  let errorObject: ErrorType = {}
  for (const [key, value] of Object.entries(inputErrors)) {
    set(errorObject, key, value)
  }
  return errorObject
}
