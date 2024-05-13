import { EducationalAttainmentRepository } from '#repositories/educational_attainment_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class EducationalAttainmentsController {
  constructor(
    protected logger: Logger,
    protected educationalAttainmentRepo: EducationalAttainmentRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/educational_attainments/index')
  }
}
