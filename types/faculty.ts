import { FundSource } from './fund_source.js'
import { Position } from './position.js'

export type FacultyJSON = {
  id: number
  givenName: string
  middleName: string
  surname: string
  gender: string
  dateOfBirth: string
  tin?: string
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

export type Faculty = {
  id: number
  givenName: string
  middleName: string
  surname: string
  gender: string
  dateOfBirth: string
  tin?: string
  positionId: number
  employmentStatus: string
  fundSourceId: number
  educations: Education[]
  position: Position
  fundSource: FundSource
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
  tin?: string
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
export interface EducationEdit extends Omit<Education, 'id'> {
  id?: number
  facultyId?: number
}
export interface AddFacultyType extends Omit<FacultyMutation, 'id' | 'educations'> {
  educations: Omit<Education, 'id'>[]
}
export interface EditFaculty extends Omit<FacultyMutation, 'educations' | 'password'> {
  educations: EducationEdit[]
  password?: string
}
