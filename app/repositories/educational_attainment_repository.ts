import EducationalAttainment from '#models/educational_attainment'
import { inject } from '@adonisjs/core'
@inject()
export class EducationalAttainmentRepository {
  async create({ name }: { name: string }) {
    const attainment = new EducationalAttainment()
    attainment.name = name
    return attainment.save()
  }
}
