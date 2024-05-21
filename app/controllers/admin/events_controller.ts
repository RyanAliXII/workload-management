// import type { HttpContext } from '@adonisjs/core/http'

import { FacultyRepository } from '#repositories/faculty_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'
@inject()
export default class EventsController {
  constructor(
    protected logger: Logger,
    protected facultyRepo: FacultyRepository
  ) {}
  async index({ view }: HttpContext) {
    const activeFaculty = await this.facultyRepo.getActive()
    return view.render('admin/events/index', {
      activeFaculty,
    })
  }
}
