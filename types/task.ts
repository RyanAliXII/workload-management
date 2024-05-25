import { Faculty } from './faculty.js'
import { User } from './user.js'

export type Task = {
  id: number
  name: string
  description: string
  faculty: Faculty
  facultyId: number
  assignedBy: User
  assignedById: number
  fileAttachments: TaskAttachment[]
}

export type TaskAttachment = {
  id: number
  taskId: number
  objectName: string
}
