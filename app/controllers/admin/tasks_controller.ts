// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
@inject()
export default class TasksController {
  constructor(protected facultyRepo: FacultyRepository) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    return view.render('admin/tasks/index', {
      activeFaculty,
    })
  }
}
