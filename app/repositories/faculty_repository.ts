import Faculty from '#models/faculty'
import LoginCredential from '#models/login_credential'
import { AddFacultyType } from '#types/faculty'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
@inject()
export class FacultyRepository {
  async create(f: AddFacultyType) {
    const trx = await db.transaction()
    try {
      const loginCredential = new LoginCredential()
      loginCredential.useTransaction(trx)
      loginCredential.email = f.email
      loginCredential.password = f.password
      await loginCredential.save()

      const faculty = new Faculty()
      faculty.useTransaction(trx)
      faculty.givenName = f.givenName
      faculty.middleName = f.middleName
      faculty.surname = f.surname
      faculty.gender = f.gender
      faculty.dateOfBirth = DateTime.fromJSDate(f.dateOfBirth)
      faculty.TIN = f.TIN ?? ''
      faculty.image = f.image ?? ''
      faculty.positionId = f.positionId
      faculty.employmentStatus = f.employmentStatus
      faculty.fundSourceId = f.fundSourceId
      faculty.mobileNumber = f.mobileNumber
      faculty.loginCredentialId = loginCredential.id
      const savedFaculty = await faculty.save()
      await faculty
        .related('educations')
        .createMany(f.educations.map((e) => ({ ...e, facultyId: savedFaculty.id })))

      await trx.commit()
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
      .select('*')
      .where('id', id)
      .limit(1)
      .first()
    return faculty
  }
}
