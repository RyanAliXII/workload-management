import Position from '#models/position'
import { inject } from '@adonisjs/core'

@inject()
export class PositionRepository {
  async create({ name }: { name: string }) {
    const position = new Position()
    position.name = name
    return position.save()
  }
  async getAll() {
    return Position.query().select(['id', 'name', 'created_at', 'updated_at'])
  }
  async update({ name, id }: { name: string; id: number }) {
    const position = await Position.findBy('id', id)
    if (!position) return null
    position.name = name
    return position.save()
  }
  async delete(id: number) {
    const position = await Position.findBy('id', id)
    if (!position) return
    position.delete()
  }
}
