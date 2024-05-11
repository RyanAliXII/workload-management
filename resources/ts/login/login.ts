import { createApp, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const data = ref('test')

    return { data }
  },
}).mount('#loginPage')
