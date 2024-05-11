import LoginCredential from '#models/login_credential'
import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const creds = await LoginCredential.create({
      email: env.get('ROOT_USER_EMAIL')?.toLowerCase(),
      password: env.get('ROOT_USER_PASSWORD'),
    })
    const dob = DateTime.fromJSDate(new Date(env.get('ROOT_USER_DATE_OF_BIRTH', '')))
    await User.create({
      givenName: env.get('ROOT_USER_GIVEN_NAME'),
      middleName: env.get('ROOT_USER_MIDDLE_NAME'),
      surname: env.get('ROOT_USER_SURNAME'),
      dateOfBirth: dob,
      address: env.get('ROOT_USER_ADDRESS'),
      loginCredentialId: creds.id,
    })
  }
}
