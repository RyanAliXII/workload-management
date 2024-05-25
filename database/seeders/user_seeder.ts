import LoginCredential from '#models/login_credential'
import User from '#models/user'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const dob = DateTime.fromJSDate(new Date(env.get('ROOT_USER_DATE_OF_BIRTH', '')))
    const password = await hash.make(env.get('ROOT_USER_PASSWORD', ''))
    const creds = await LoginCredential.create({
      email: env.get('ROOT_USER_EMAIL')?.toLowerCase(),
      password,
    })
    const user = await User.query().limit(1).first()
    if (user) return
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
