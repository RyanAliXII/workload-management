import Faculty from '#models/faculty'

export type AddEvent = {
  name: string
  from: Date
  to: Date
  facilitatorIds: number[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}

export type Event = {
  name: string
  from: Date
  to: Date
  facilitators: Faculty[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}

export type EventJSON = {
  name: string
  from: string
  to: string
  facilitators: Faculty[]
  location: string
  description?: string
  status: 'approved' | 'unapproved'
}
