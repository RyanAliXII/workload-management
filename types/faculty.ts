export type FacultyJSON = {
  id: number
  givenName: string
  middleName: string
  surname: string
  gender: string
  dateOfBirth: string
  TIN?: string
  positionId: number
  employmentStatus: string
  fundSourceId: number
  educations: Education[]
  loginCredential: {
    id: number
    email: string
  }
  image?: string
  mobileNumber: string
}
export type FacultyMutation = {
  id: number
  givenName: string
  middleName: string
  surname: string
  gender: string
  dateOfBirth: Date
  TIN?: string
  positionId: number
  employmentStatus: string
  fundSourceId: number
  educations: Education[]
  email: string
  image?: string
  mobileNumber: string
  password: string
}
export type Education = { id: number; almaMater: string; educationalAttainmentId: number }

export interface AddFacultyType extends Omit<FacultyMutation, 'id' | 'educations'> {
  educations: Omit<Education, 'id'>[]
}
export interface EditFaculty extends Omit<FacultyMutation, 'educations' | 'password'> {
  educations: Omit<Education, 'id'>[]
  password?: string
}
