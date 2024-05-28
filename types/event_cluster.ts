import { Department } from './department.js'
import { Faculty } from './faculty.js'

export type AddEventCluster = {
  name: string
  from: Date
  to: Date
  departmentId: number
  facilitatorIds: number[]
  location: string
  description?: string
  createdById?: number | null
}

export type EditEventCluster = {
  id: number
  name: string
  from: Date
  to: Date
  departmentId: number
  facilitatorIds: number[]
  location: string
  description?: string
  createdById?: number | null
}

export type EventClusterJSON = {
  id: number
  name: string
  from: string
  to: string
  facilitators: Faculty[]
  location: string
  description?: string
  department: Department
  departmentId: number
}
export type EventCluster = {
  id: number
  name: string
  from: Date
  to: Date
  facilitators: Faculty[]
  location: string
  description?: string
  department: Department
  departmentId: number
}
