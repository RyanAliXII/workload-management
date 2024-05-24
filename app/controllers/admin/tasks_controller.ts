// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  async index({ view }: HttpContext) {
    return view.render('admin/tasks/index')
  }
}
