import type { HttpContext } from '@adonisjs/core/http'

export default class FundSourcesController {
  async index({ view }: HttpContext) {
    return view.render('admin/fund_sources/index')
  }
}
