const AdminLoginController = () => import('#controllers/admin/login_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

router.get('/', async (ctx: HttpContext) => {
  return ctx.view.render('welcome')
})

/*Start of admin routes*/
router
  .group(() => {
    router.get('/login', [AdminLoginController, 'index'])
    router.get('/dashboard', [AdminDashboardController, 'index'])
  })
  .prefix('/admin')

/*End of admin routes*/
