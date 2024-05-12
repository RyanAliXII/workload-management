import Department from '#models/department'
import { inject } from '@adonisjs/core'

@inject()
export class DepartmentRepository {
  async create({ name }: { name: string }) {
    const department = new Department()
    department.name = name
    return department.save()
  }
}
