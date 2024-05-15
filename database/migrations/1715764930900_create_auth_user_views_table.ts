import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_user_view'

  async up() {
    this.schema.createViewOrReplace(this.tableName, (view) => {
      view.columns(['id', 'given_name', 'middle_name', 'surname', 'email', 'password'])
      view.as(
        this.knex()
          .select(['user.id', 'given_name', 'middle_name', 'surname', 'email', 'password'])
          .innerJoin(this.raw('login_credential on user.login_credential_id = login_credential.id'))
          .from('user')
      )
    })
  }

  async down() {
    this.schema.dropView(this.tableName)
  }
}
