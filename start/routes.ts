const AdminLoginController = () => import('#controllers/admin/login_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const PositionsController = () => import('#controllers/admin/positions_controller')
const SubjectsController = () => import('#controllers/admin/subjects_controller')
const DepartmentsController = () => import('#controllers/admin/departments_controller')
const EducationalAttainmentsController = () =>
  import('#controllers/admin/educational_attainments_controller')
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
        router.delete('/departments/:id', [DepartmentsController, 'delete'])
        router.get('/positions', [PositionsController, 'index'])
        router.post('/positions', [PositionsController, 'create'])
        router.put('/positions/:id', [PositionsController, 'edit'])
        router.delete('/positions/:id', [PositionsController, 'delete'])
        router.get('/subjects', [SubjectsController, 'index'])
        router.post('/subjects', [SubjectsController, 'create'])
        router.put('/subjects/:id', [SubjectsController, 'edit'])
        router.delete('/subjects/:id', [SubjectsController, 'delete'])
        router.get('/educational-attainments', [EducationalAttainmentsController, 'index'])
      })
      .use(middleware.auth({ guards: ['admin'], redirectTo: '/admin/login' }))
  })
  .prefix('/admin')

/*End of admin routes*/
