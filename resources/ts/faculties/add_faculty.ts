import { createApp, ref } from 'vue'

createApp({
  setup() {
    const form = ref({
      givenName: '',
      middleName: '',
      surname: '',
      dateOfBirth: new Date(),
      TIN: '',
      positionId: 0,
      employmentStatus: '',
      fundSourceId: 0,
      education: [],
      email: '',
      mobileNumber: '',
      password: '',
    })
    const errors = ref({})

    return {
      form,
      errors,
    }
  },
}).mount('#addFacultyPage')
