import adonisjs from '@adonisjs/vite/client'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } },

  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */

      entrypoints: [
        'resources/js/setup.js',
        'resources/ts/login/login.ts',
        'resources/ts/departments/departments.ts',
        'resources/ts/positions/positions.ts',
        'resources/ts/subjects/subjects.ts',
        'resources/ts/faculty-login/login.ts',
        'resources/ts/educational_attainments/educational_attainments.ts',
        'resources/ts/fund_sources/fund_sources.ts',
        'resources/ts/faculties/add_faculty.ts',
        'resources/ts/faculties/edit_faculty.ts',
        'resources/ts/events/add_event_modal.ts',
        'resources/ts/events/edit_event_modal.ts',
        'resources/ts/faculty/events/edit_event_modal.ts',
        'resources/ts/faculty/events/add_event_modal.ts',
        'resources/ts/faculty/tasks/completion_modal.ts',
        'resources/ts/faculty/tasks/view_task_modal.ts',
        'resources/ts/faculty/events/view_event_modal.ts',
        'resources/ts/faculty/tasks/task_table.ts',
        'resources/ts/faculty/events/event_calendar.ts',
        'resources/ts/faculty/lesson-plans/add_lesson_plan.ts',
        'resources/ts/faculty/lesson-plans/view_lesson_plan.ts',
        'resources/ts/faculty/lesson-plans/edit_lesson_plan.ts',
        'resources/ts/faculty/lesson-plans/lesson_plans.ts',
        'resources/ts/lesson-plans/lesson_plans.ts',
        'resources/ts/lesson-plans/view_lesson_plan.ts',
        'resources/ts/events/view_event_modal.ts',
        'resources/ts/faculties/add_faculty.ts',
        'resources/ts/faculties/edit_faculty.ts',
        'resources/ts/faculties/faculties.ts',
        'resources/ts/tasks/add_task_modal.ts',
        'resources/ts/tasks/edit_task_modal.ts',
        'resources/ts/tasks/view_task_modal.ts',
        'resources/ts/tasks/task_table.ts',
        'resources/ts/announcements/announcements.ts',
        'resources/ts/announcements/public_announcement.ts',
        'resources/vendors/bootstrap/dist/css/bootstrap.min.css',
        'resources/vendors/@fortawesome/fontawesome-free/css/all.min.css',
        'resources/vendors/ionicons-npm/css/ionicons.css',
        'resources/vendors/linearicons-master/dist/web-font/style.css',
        'resources/vendors/pixeden-stroke-7-icon-master/pe-icon-7-stroke/dist/pe-icon-7-stroke.css',
        'resources/ts/event-clustering/add_event_modal.ts',
        'resources/ts/event-clustering/edit_event_modal.ts',
        'resources/ts/event-clustering/view_event_modal.ts',
        'resources/ts/event-clustering/event_calendar.ts',
        'resources/ts/public_events/public_events.ts',
        'resources/css/base.css',
        'resources/css/homepage.css',
        'resources/vendors/jquery/dist/jquery.min.js',
        'resources/vendors/bootstrap/dist/js/bootstrap.bundle.min.js',
        'resources/ts/faculty/event-clustering/view_event_modal.ts',
        'resources/ts/faculty/event-clustering/event_calendar.ts',
        // 'resources/vendors/moment/moment.js',
        // 'resources/vendors/metismenu/dist/metisMenu.js',
        // 'resources/vendors/bootstrap4-toggle/js/bootstrap4-toggle.min.js',
        // 'resources/vendors/jquery-circle-progress/dist/circle-progress.min.js',
        // 'resources/vendors/perfect-scrollbar/dist/perfect-scrollbar.min.js',
        // 'resources/vendors/jquery.fancytree/dist/jquery.fancytree-all-deps.min.js',
        // 'resources/vendors/apexcharts/dist/apexcharts.min.js',
        // 'resources/js/charts/apex-charts.js',
        // 'resources/js/circle-progress.js',
        // 'resources/js/demo.js',
        // 'resources/js/scrollbar.js',
        // 'resources/js/treeview.js',
        // 'resources/js/form-components/toggle-switch.js',
        // 'resources/js/app.js',
        'resources/vendors/slick-carousel/slick/slick.min.js',
        'resources/js/carousel-slider.js',
      ],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
