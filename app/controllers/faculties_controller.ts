import type { HttpContext } from '@adonisjs/core/http'

export default class FacultiesController {
  async index({ view }: HttpContext) {
    return view.render('admin/faculties/index')
  }
  async add({ view }: HttpContext) {
    return view.render('admin/faculties/add-faculty')
  }
}
