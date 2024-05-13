import { StatusCodes } from 'http-status-codes'
import { createApp, ref } from 'vue'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const message = ref('')
    const form = ref({
      email: '',
      password: '',
    })
    const onSubmit = async () => {
      message.value = ''
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(form.value),
      })

      const responseBody: any = await response.json()
      if (response.status === StatusCodes.OK) {
        window.location.replace('/admin/dashboard')
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        message.value = responseBody?.message
      }
    }
    return { form, onSubmit, message }
  },
}).mount('#loginPage')
