export type AddEvent = {
  name: string
  from: Date
  to: Date
  facilitatorIds: number[]
  location: string
  description: string
  status: 'approved' | 'unapproved'
}
