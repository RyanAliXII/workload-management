import { AddFacultyType } from '#types/faculty'
import { createApp, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../utils/form.js'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const INITIAL_FORM = {
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
    }
    const form = ref<AddFacultyType>({ ...INITIAL_FORM })
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
    const clearErrors = () => {
      errors.value = {}
    }
    const resetForm = () => {
      form.value = { ...INITIAL_FORM }
      facultyImage.value = null
    }
    const submit = async () => {
      clearErrors()
      isSubmitting.value = true
      await uploadImage()
      const response = await fetch('/admin/faculties', {
        method: 'POST',
        body: JSON.stringify({
          ...form.value,
          dateOfBirth: toISO8601DateString(form.value.dateOfBirth),
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        resetForm()
        toastr.success('Faculty created')
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
          console.log(errors.value)
        }
      }
      if (response.status > StatusCodes.BAD_REQUEST) {
        toastr.error('Unknown error occured.')
      }
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
