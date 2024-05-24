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

  async update({
    id,
    name,
    description,
    facultyId,
    assignedById,
  }: {
    id: number
    name: string
    description: string
    facultyId: number
    assignedById: number
  }) {
    return await Task.updateOrCreate(
      { id },
      {
        name,
        description,
        facultyId,
        assignedById,
      }
    )
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
  async delete(id: number) {
    const task = await Task.findBy('id', id)
    if (!task) return
    task.delete()
  }
  async getOne(id: number) {
    return Task.query().preload('fileAttachments').where('id', id).limit(1).first()
  }

  async getByStatus(status: string) {
    if (status === 'completed') {
      return Task.query()
        .preload('assignedBy')
        .preload('faculty', (b) => {
          b.preload('position')
          b.preload('loginCredential')
        })
        .whereNotNull('completed_at')
        .preload('fileAttachments')
    }
    if (status === 'pending') {
      return Task.query()
        .preload('assignedBy')
        .preload('faculty', (b) => {
          b.preload('position')
          b.preload('loginCredential')
        })
        .whereNull('completed_at')
        .preload('fileAttachments')
    }
    return this.getAll()
  }
}
