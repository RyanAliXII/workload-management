import Position from '#models/position'
import { inject } from '@adonisjs/core'

@inject()
export class PositionRepository {
  async create({ name }: { name: string }) {
    const position = new Position()
    position.name = name
    return position.save()
  }
}
