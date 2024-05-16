import Faculty from '#models/faculty'
import { AddFacultyType } from '#types/faculty'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
@inject()
export class FacultyRepository {
  async create(f: AddFacultyType) {
    const trx = await db.transaction()
    try {
      const faculty = new Faculty()
      faculty.useTransaction(trx)
      faculty.givenName = f.givenName
      faculty.middleName = f.middleName
      faculty.surname = f.surname
      faculty.gender = f.gender
      faculty.TIN = f.TIN
      faculty.positionId = f.positionId
      faculty.employmentStatus = f.employmentStatus
      faculty.fundSourceId = f.fundSourceId
      faculty.mobileNumber = f.mobileNumber
      await faculty.save()
      await faculty.related('educations').createMany(f.educations)
      await faculty.related('loginCredential').create({
        email: f.email,
        password: f.password,
      })
      await trx.commit()
    } catch (err) {
      trx.rollback()
      throw err
    }
  }
}
