import EducationalAttainment from '#models/educational_attainment'
import { inject } from '@adonisjs/core'
@inject()
export class EducationalAttainmentRepository {
  async getAll() {
    return EducationalAttainment.query()
      .select(['id', 'name', 'created_at', 'updated_at'])
      .orderBy('created_at', 'desc')
  }
  async create({ name }: { name: string }) {
    const attainment = new EducationalAttainment()
    attainment.name = name
    return attainment.save()
  }
}
