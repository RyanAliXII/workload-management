import { EducationalAttainmentRepository } from '#repositories/educational_attainment_repository'
import { FundSourceRepository } from '#repositories/fund_source_respository'
import { PositionRepository } from '#repositories/position_repository'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class FacultiesController {
  constructor(
    protected positionRepo: PositionRepository,
    protected fundSourceRepo: FundSourceRepository,
    protected educationalAttainmentRepo: EducationalAttainmentRepository
  ) {}
  async index({ view }: HttpContext) {
    return view.render('admin/faculties/index')
  }
  async add({ view }: HttpContext) {
    const positions = await this.positionRepo.getAll()
    const fundSources = await this.fundSourceRepo.getAll()
    const educationalAttainments = await this.educationalAttainmentRepo.getAll()
    return view.render('admin/faculties/add-faculty', {
      positions,
      fundSources,
      educationalAttainments,
    })
  }
}
