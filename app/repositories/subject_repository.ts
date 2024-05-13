import Subject from '#models/subject'
import { inject } from '@adonisjs/core'

@inject()
export class SubjectRepository {
  async create({ name }: { name: string }) {
    const subject = new Subject()
    subject.name = name
    return subject.save()
  }
}
