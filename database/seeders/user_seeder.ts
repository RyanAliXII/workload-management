import LoginCredential from '#models/login_credential'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const creds = await LoginCredential.create({
      email: 'ryanali456@gmail.com',
      password: 'password',
    })
    const dob = DateTime.fromJSDate(new Date('2000-08-25'))
    await User.create({
      givenName: 'Ryan',
      middleName: 'Aringino',
      surname: 'Ali',
      dateOfBirth: dob,
      address: '',
      loginCredentialId: creds.id,
    })
  }
}
