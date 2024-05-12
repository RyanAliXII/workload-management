import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export class UserRepository {
  async getByEmail(email: string) {
    const user = await User.query()
      .whereHas('loginCredential', (builder) => {
        builder.where('email', email.toLowerCase())
      })
      .preload('loginCredential')
      .first()
    return user
  }
}
