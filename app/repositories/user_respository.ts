import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export class UserRepository {
  async getByEmail(email: string) {
    const user = User.query()
      .select('user.id', 'givenName', 'email', 'password')
      .preload('loginCredential')
      .innerJoin('login_credential', 'login_credential_id', 'user.id')

    return user.limit(1).first()
  }
}
