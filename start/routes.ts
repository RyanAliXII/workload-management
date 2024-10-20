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
const FacultyLessonPlansController = () => import('#controllers/faculty/lesson_plans_controller')
const AdminLessonPlansController = () => import('#controllers/admin/lesson_plans_controller')
const AnnouncementsController = () => import('#controllers/admin/announcements_controller')
const EventClustersController = () => import('#controllers/admin/event_clusters_controller')
const FacultyClustersController = () => import('#controllers/faculty/event_clusters_controller')
const PublicEventsController = () => import('#controllers/public_events_controller')
const UsersController = () => import('#controllers/admin/users_controller')
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async (ctx: HttpContext) => {
  return ctx.view.render('welcome')
})
router.get('/announcements', (ctx: HttpContext) => {
  return ctx.view.render('announcements')
})
router.get('/announcements/all', [AnnouncementsController, 'getAll'])
router.get('/events', [PublicEventsController, 'index'])
router.get('/events/public', [PublicEventsController, 'publicEvents'])
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
        router.get('/lesson-plans', [AdminLessonPlansController, 'index'])
        router.get('/lesson-plans/view/:id', [AdminLessonPlansController, 'viewPage'])
        router.get('/lesson-plans/one/:id', [AdminLessonPlansController, 'getOne'])
        router.post('/lesson-plans/:lessonPlanId/comments', [
          AdminLessonPlansController,
          'createComment',
        ])
        router.get('/announcements', [AnnouncementsController, 'index'])
        router.post('/announcements', [AnnouncementsController, 'create'])
        router.get('/announcements/all', [AnnouncementsController, 'getAll'])
        router.put('/announcements/:id', [AnnouncementsController, 'edit'])
        router.delete('/announcements/:id', [AnnouncementsController, 'delete'])
        router.get('/event-clusters', [EventClustersController, 'index'])
        router.get('/event-clusters/departments/:departmentId/faculty', [
          EventClustersController,
          'getFacultyByDepartment',
        ])
        router.post('/event-clusters', [EventClustersController, 'create'])
        router.put('/event-clusters/:id', [EventClustersController, 'edit'])
        router.delete('/event-clusters/:id', [EventClustersController, 'delete'])
        router.get('/users', [UsersController, 'index'])
        router.post('/announcements/thumbnails', [AnnouncementsController, 'uploadThumbnail'])
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
        router.get('/lesson-plans/', [FacultyLessonPlansController, 'index'])
        router.get('/lesson-plans/one/:id', [FacultyLessonPlansController, 'getOne'])
        router.get('/lesson-plans/create', [FacultyLessonPlansController, 'createPage'])
        router.post('/lesson-plans', [FacultyLessonPlansController, 'create'])
        router.get('/lesson-plans/view/:id', [FacultyLessonPlansController, 'viewPage'])
        router.get('/lesson-plans/edit/:id', [FacultyLessonPlansController, 'editPage'])
        router.put('/lesson-plans/:id', [FacultyLessonPlansController, 'edit'])
        router.delete('/lesson-plans/:id', [FacultyLessonPlansController, 'delete'])
        router.get('/event-clusters', [FacultyClustersController, 'index'])
        router.post('/lesson-plans/:lessonPlanId/comments', [
          FacultyLessonPlansController,
          'createComment',
        ])
      })
      .use(middleware.auth({ guards: ['faculty'], redirectTo: '/faculties/login' }))
  })
  .prefix('/faculties')

/*End of admin routes*/
