export type Faculty = {
  id: number
  givenName: string
  middleName: string
  surname: string
  gender: string
  dateOfBirth: Date
  TIN: string
  positionId: number
  employmentStatus: string
  fundSourceId: number
  educations: Education[]
  email: string
  mobileNumber: string
  password: string
}
export type Education = { id: number; almaMater: string; educationalAttainmentId: number }

export interface AddFacultyType extends Omit<Faculty, 'id' | 'educations'> {
  educations: Omit<Education, 'id'>[]
}
