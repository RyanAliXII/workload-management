const AdminLoginController = () => import('#controllers/admin/login_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')

import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const DepartmentsController = () => import('#controllers/admin/departments_controller')

router.get('/', async (ctx: HttpContext) => {
  return ctx.view.render('welcome')
})

/*Start of admin routes*/
router
  .group(() => {
    router.get('/login', [AdminLoginController, 'index'])
    router.post('/login', [AdminLoginController, 'login'])
    router
      .group(() => {
        router.get('/dashboard', [AdminDashboardController, 'index'])
        router.get('/departments', [DepartmentsController, 'index'])
        router.post('/departments', [DepartmentsController, 'create'])
        router.put('/departments/:id', [DepartmentsController, 'edit'])
      })
      .use(middleware.auth({ guards: ['admin'], redirectTo: '/admin/login' }))
  })
  .prefix('/admin')

/*End of admin routes*/
