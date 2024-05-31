import { AddFacultyType } from '#types/faculty'
import { createApp, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../utils/form.js'
import toastr from 'toastr'
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
      tin: '',
      positionId: 0,
      employmentStatus: '',
      fundSourceId: 0,
      educations: [],
      email: '',
      image: '',
      mobileNumber: '',
      password: '',
      departmentId: 0,
    }
    const form = ref<AddFacultyType>({ ...INITIAL_FORM })
    const isSubmitting = ref(false)
    const facultyImage = ref<File | null>(null)
    const yearNow = new Date().getFullYear()
    const maxDate = new Date()
    maxDate.setFullYear(yearNow + 1, 0, 0)
    const errors = ref({})
    const addEducation = () => {
      form.value.educations.push({
        almaMater: '',
        educationalAttainmentId: 0,
      })
    }
    const removeEducationByIndex = (index: number) => {
      form.value.educations = form.value.educations.filter((_, idx) => idx !== index)
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
    const uploadImage = async (facultyId: number) => {
      try {
        if (!facultyImage.value || !facultyId) {
          return
        }
        const formData = new FormData()
        formData.append('facultyId', facultyId.toString())
        formData.append('image', facultyImage.value)
        await fetch('/admin/faculties/images', {
          method: 'POST',
          body: formData,
        })
      } catch (error) {
        console.error(error)
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
        await uploadImage(responseBody?.faculty?.id)
        toastr.success('Faculty created')
        resetForm()
      }
      if (response.status === StatusCodes.BAD_REQUEST) {
        if (responseBody?.errors) {
          errors.value = toStructuredErrors(responseBody.errors)
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
      maxDate,
      submit,
      isSubmitting,
    }
  },
}).mount('#addFacultyPage')
