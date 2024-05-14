import FundSource from '#models/fund_source'
import { inject } from '@adonisjs/core'
@inject()
export class FundSourceRepository {
  create({ name }: { name: string }) {
    const fundSource = new FundSource()
    fundSource.name = name
    return fundSource.save()
  }
  async getAll() {
    return FundSource.query()
      .select(['id', 'name', 'created_at', 'updated_at'])
      .orderBy('created_at', 'desc')
  }
}
