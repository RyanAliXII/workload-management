import Task from '#models/task'
import { inject } from '@adonisjs/core'

@inject()
export class TaskRepository {
  async create({
    name,
    description,
    facultyId,
    assignedById,
  }: {
    name: string
    description: string
    facultyId: number
    assignedById: number
  }) {
    return await Task.create({
      name,
      description,
      facultyId,
      assignedById,
    })
  }
  async getAll() {
    return Task.query()
      .preload('assignedBy')
      .preload('faculty', (b) => {
        b.preload('position')
        b.preload('loginCredential')
      })
      .preload('fileAttachments')
  }
}
