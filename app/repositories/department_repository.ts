import Department from '#models/department'
import { inject } from '@adonisjs/core'

@inject()
export class DepartmentRepository {
  async create(department: Department) {
    return department.save()
  }
}
