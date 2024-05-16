import { AddFacultyType } from '#types/faculty'
import { createApp, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import { StatusCodes } from 'http-status-codes'

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
      image: '',
      mobileNumber: '',
      password: '',
    })
    const isSubmitting = ref(false)

    const facultyImage = ref<File | null>(null)

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
    const handleImageSelection = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files) {
        facultyImage.value = input.files[0]
        form.value.image = URL.createObjectURL(input.files?.[0])
      }
    }
    const uploadImage = async () => {
      if (!facultyImage.value) {
        return
      }
      const formData = new FormData()
      formData.append('image', facultyImage.value)
      const response = await fetch('/admin/faculties/images', {
        method: 'POST',
        body: formData,
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        form.value.image = responseBody?.publicId ?? ''
      }
    }
    const submit = async () => {
      isSubmitting.value = true
      await uploadImage()
      isSubmitting.value = false
    }
    return {
      form,
      errors,
      addEducation,
      removeEducationByIndex,
      handleDateOfBirth,
      toISO8601DateString,
      handleImageSelection,
      submit,
      isSubmitting,
    }
  },
}).mount('#addFacultyPage')
