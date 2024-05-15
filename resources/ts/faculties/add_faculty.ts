import { AddFacultyType } from '#types/faculty'
import { createApp, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const form = ref<AddFacultyType>({
      givenName: '',
      middleName: '',
      surname: '',
      gender: '',
      dateOfBirth: new Date(),
      TIN: '',
      positionId: 0,
      employmentStatus: '',
      fundSourceId: 0,
      educations: [],
      email: '',
      mobileNumber: '',
      password: '',
    })

    const errors = ref({})
    const addEducation = () => {
      form.value.educations.push({
        almaMater: '',
        educationalAttainmentId: 0,
      })
    }
    const removeEducationByIndex = (index: number) => {
      form.value.educations = form.value.educations.filter((e, idx) => idx !== index)
    }
    const handleDateOfBirth = (event: Event) => {
      const input = event.target as HTMLInputElement
      form.value.dateOfBirth = new Date(input.value)
    }
    return {
      form,
      errors,
      addEducation,
      removeEducationByIndex,
      handleDateOfBirth,
      toISO8601DateString,
    }
  },
}).mount('#addFacultyPage')
