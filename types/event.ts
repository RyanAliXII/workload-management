import { Faculty } from './faculty.js'

export type AddEvent = {
  name: string
  from: Date
  to: Date
  facilitatorIds: number[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}
export type EditEvent = {
  id: number
  name: string
  from: Date
  to: Date
  facilitatorIds: number[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}

export type Event = {
  id: number
  name: string
  from: Date
  to: Date
  facilitators: Faculty[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}

export type EventJSON = {
  id: number
  name: string
  from: string
  to: string
  facilitators: Faculty[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}
