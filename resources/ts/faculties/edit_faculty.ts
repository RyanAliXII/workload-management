import { EditFaculty, FacultyJSON } from '#types/faculty'
import { createApp, onMounted, ref } from 'vue'
import { toISO8601DateString } from '../utils/date.js'
import { StatusCodes } from 'http-status-codes'
import { toStructuredErrors } from '../utils/form.js'

createApp({
  compilerOptions: {
    delimiters: ['${', '}'],
  },
  setup() {
    const INITIAL_FORM = {
      id: 0,
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
    const form = ref<EditFaculty>({ ...INITIAL_FORM })
    const isSubmitting = ref(false)
    const facultyImage = ref<File | null>(null)
    onMounted(() => {
      const data = window.viewData as FacultyJSON
      console.log(data)
      form.value = {
        id: data.id,
        givenName: data.givenName,
        middleName: data.middleName,
        surname: data.surname,
        dateOfBirth: new Date(data.dateOfBirth),
        educations: data.educations,
        email: data.loginCredential.email,
        employmentStatus: data.employmentStatus,
        fundSourceId: data.fundSourceId,
        gender: data.gender,
        mobileNumber: data.mobileNumber,
        positionId: data.positionId,
        image: data.image,
        tin: data.tin,
        password: '',
      }
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
    const submit = async () => {
      clearErrors()
      isSubmitting.value = true
      await uploadImage()
      const response = await fetch(`/admin/faculties/${form.value.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...form.value,
          dateOfBirth: toISO8601DateString(form.value.dateOfBirth),
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const responseBody = await response.json()
      if (response.status === StatusCodes.OK) {
        toastr.success('Faculty updated.')
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
      submit,
      isSubmitting,
    }
  },
}).mount('#editFacultyPage')
