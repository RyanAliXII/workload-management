import { HttpContext } from '@adonisjs/core/http'
export default class PositionsController {
  async index({ view }: HttpContext) {
    return view.render('admin/positions/index')
  }
}
