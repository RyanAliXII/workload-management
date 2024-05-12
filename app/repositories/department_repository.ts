import Department from '#models/department'
import { inject } from '@adonisjs/core'

@inject()
export class DepartmentRepository {
  async create({ name }: { name: string }) {
    const department = new Department()
    department.name = name
    return department.save()
  }
  async update({ name, id }: { name: string; id: number }) {
    const department = await Department.findBy('id', id)
    if (!department) return null
    department.name = name
    return department.save()
  }
  async getDepartments() {
    const departments = await Department.query()
      .select(['id', 'name', 'created_at', 'updated_at'])
      .orderBy('created_at', 'asc')
    return departments
  }
}
