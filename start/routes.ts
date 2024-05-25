const AdminLoginController = () => import('#controllers/admin/login_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const FacultyLoginController = () => import('#controllers/faculty/login_controller')
const FacultyDashboardController = () => import('#controllers/faculty/dashboard_controller')
const PositionsController = () => import('#controllers/admin/positions_controller')
const SubjectsController = () => import('#controllers/admin/subjects_controller')
const DepartmentsController = () => import('#controllers/admin/departments_controller')
const EducationalAttainmentsController = () =>
  import('#controllers/admin/educational_attainments_controller')
const FundSourcesController = () => import('#controllers/admin/fund_sources_controller')
const FacultiesController = () => import('#controllers/admin/faculties_controller')
const EventsController = () => import('#controllers/admin/events_controller')
const FacultyEventsController = () => import('#controllers/faculty/events_controller')
const AdminTaskController = () => import('#controllers/admin/tasks_controller')
const FacultyTasksController = () => import('#controllers/faculty/tasks_controller')
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
        router.post('/educational-attainments', [EducationalAttainmentsController, 'create'])
        router.put('/educational-attainments/:id', [EducationalAttainmentsController, 'edit'])
        router.delete('/educational-attainments/:id', [EducationalAttainmentsController, 'delete'])
        router.get('/fund-sources', [FundSourcesController, 'index'])
        router.post('/fund-sources', [FundSourcesController, 'create'])
        router.put('/fund-sources/:id', [FundSourcesController, 'edit'])
        router.delete('/fund-sources/:id', [FundSourcesController, 'delete'])
        router.get('/faculties', [FacultiesController, 'index'])
        router.get('/faculties/add', [FacultiesController, 'add'])
        router.post('/faculties/images', [FacultiesController, 'uploadFacultyImage'])
        router.post('/faculties', [FacultiesController, 'create'])
        router.get('/faculties/edit/:id', [FacultiesController, 'editPage'])
        router.put('/faculties/:id', [FacultiesController, 'edit'])
        router.delete('/faculties/:id', [FacultiesController, 'delete'])
        router.get('/events', [EventsController, 'index'])
        router.post('/events', [EventsController, 'create'])
        router.put('/events/:id', [EventsController, 'edit'])
        router.delete('/events/:id', [EventsController, 'delete'])
        router.get('/tasks', [AdminTaskController, 'index'])
        router.post('/tasks', [AdminTaskController, 'create'])
        router.post('/tasks/attachments', [AdminTaskController, 'uploadTaskAttachments'])
        router.put('/tasks/:id', [AdminTaskController, 'edit'])
        router.delete('/tasks/:id', [AdminTaskController, 'delete'])
        router.get('/tasks/:id/attachments', [AdminTaskController, 'getAttachmentByTaskId'])
      })
      .use(middleware.auth({ guards: ['admin'], redirectTo: '/admin/login' }))
  })
  .prefix('/admin')
router
  .group(() => {
    router.get('/login', [FacultyLoginController, 'index'])
    router.post('/login', [FacultyLoginController, 'login'])
    router
      .group(() => {
        router.get('/dashboard', [FacultyDashboardController, 'index'])
        router.get('/events', [FacultyEventsController, 'index'])
        router.post('/events', [FacultyEventsController, 'create'])
        router.put('/events/:id', [FacultyEventsController, 'edit'])
        router.delete('/events/:id', [FacultyEventsController, 'edit'])
        router.get('/tasks', [FacultyTasksController, 'index'])
        router.get('/tasks/:id/attachments', [FacultyTasksController, 'getAttachmentByTaskId'])
        router.post('/tasks/attachments', [FacultyTasksController, 'uploadTaskAttachments'])
        router.patch('/tasks/:id/completion', [FacultyTasksController, 'updateCompletion'])
      })
      .use(middleware.auth({ guards: ['faculty'], redirectTo: '/faculties/login' }))
  })
  .prefix('/faculties')

/*End of admin routes*/
