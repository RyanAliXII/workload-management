import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

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
        'resources/ts/login/login.ts',
        'resources/ts/departments/departments.ts',
        'resources/ts/positions/positions.ts',
        'resources/ts/subjects/subjects.ts',
        'resources/ts/educational_attainments/educational_attainments.ts',
      ],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
