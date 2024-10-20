import Faculty from '#models/faculty'
import LoginCredential from '#models/login_credential'
import { AddFacultyType, EditFaculty } from '#types/faculty'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
@inject()
export class FacultyRepository {
  async getAll() {
    return Faculty.query()
      .preload('educations')
      .preload('position')
      .preload('loginCredential')
      .preload('fundSource')
      .preload('department')
  }
  async getActive() {
    return Faculty.query()
      .preload('educations')
      .preload('position')
      .preload('loginCredential')
      .preload('fundSource')
      .whereIn('employment_status', ['regular', 'part-time'])
      .preload('department')
  }
  async create(f: AddFacultyType) {
    const trx = await db.transaction()
    try {
      const loginCredential = new LoginCredential()
      loginCredential.useTransaction(trx)
      loginCredential.email = f.email.toLowerCase()
      loginCredential.password = f.password
      await loginCredential.save()
      const faculty = new Faculty()
      faculty.useTransaction(trx)
      faculty.givenName = f.givenName
      faculty.middleName = f.middleName ?? ''
      faculty.surname = f.surname
      faculty.gender = f.gender
      faculty.dateOfBirth = DateTime.fromJSDate(f.dateOfBirth)
      faculty.tin = f.tin ?? ''
      faculty.image = f.image ?? ''
      faculty.positionId = f.positionId
      faculty.employmentStatus = f.employmentStatus
      faculty.fundSourceId = f.fundSourceId
      faculty.mobileNumber = f.mobileNumber
      faculty.loginCredentialId = loginCredential.id
      faculty.departmentId = f.departmentId
      const savedFaculty = await faculty.save()
      await faculty
        .related('educations')
        .createMany(f.educations.map((e) => ({ ...e, facultyId: savedFaculty.id })))

      await trx.commit()
      return faculty
    } catch (err) {
      trx.rollback()
      throw err
    }
  }
  async findById(id: number) {
    const faculty = Faculty.query()
      .preload('educations')
      .preload('fundSource')
      .preload('position')
      .preload('loginCredential')
      .preload('department')
      .select('*')
      .where('id', id)
      .limit(1)
      .first()
    return faculty
  }
  async findByDepartmentAndActive(departmentId: number) {
    return Faculty.query()
      .preload('educations')
      .preload('fundSource')
      .preload('position')
      .preload('loginCredential')
      .preload('department')
      .andWhere((b) => {
        b.where('department_id', departmentId)
        b.whereIn('employment_status', ['regular', 'part-time'])
      })
  }
  async updateFacultyImage(id: number, image: string) {
    const faculty = await Faculty.findBy('id', id)
    if (!faculty) return null
    faculty.image = image
    return faculty.save()
  }
  async update(f: EditFaculty) {
    const trx = await db.transaction()
    try {
      const faculty = await Faculty.query()
        .preload('educations')
        .preload('fundSource')
        .preload('position')
        .preload('loginCredential')
        .select('*')
        .where('id', f.id)
        .limit(1)
        .first()

      if (!faculty) return null

      faculty.useTransaction(trx)
      faculty.givenName = f.givenName
      faculty.middleName = f.middleName ?? ''
      faculty.surname = f.surname
      faculty.gender = f.gender
      faculty.dateOfBirth = DateTime.fromJSDate(f.dateOfBirth)
      faculty.tin = f.tin ?? ''
      faculty.image = f.image ?? ''
      faculty.positionId = f.positionId
      faculty.employmentStatus = f.employmentStatus
      faculty.fundSourceId = f.fundSourceId
      faculty.mobileNumber = f.mobileNumber
      faculty.departmentId = f.departmentId
      await faculty.save()
      if (!f.password) {
        await faculty
          .related('loginCredential')
          .updateOrCreate({ id: faculty.loginCredentialId }, { email: f.email.toLowerCase() })
      } else {
        await faculty
          .related('loginCredential')
          .updateOrCreate(
            { id: faculty.loginCredentialId },
            { email: f.email.toLowerCase(), password: f.password }
          )
      }
      await faculty.related('educations').query().delete()
      await faculty.related('educations').createMany(f.educations)
      await trx.commit()
      return faculty
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }
  async delete(id: number) {
    const faculty = await Faculty.findBy('id', id)
    if (!faculty) return
    faculty.delete()
  }
}
