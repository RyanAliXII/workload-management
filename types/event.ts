export type AddEvent = {
  name: string
  from: Date
  to: Date
  facilitatorIds: number[]
  location: string
  status: 'approved' | 'unapproved'
}
