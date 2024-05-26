import Announcement from '#models/announcement'
import { inject } from '@adonisjs/core'

@inject()
export class AnnouncementRepository {
  async create(announcement: { title: string; content: string }) {
    return Announcement.create(announcement)
  }
  async update(announcement: { id: number; title: string; content: string }) {
    const a = await Announcement.findBy('id', announcement.id)
    if (!a) return null
    a.title = announcement.title
    a.content = announcement.content
    return a.save()
  }
  async getAll() {
    return Announcement.query().orderBy('created_at', 'desc')
  }
  async delete(id: number) {
    const announcement = await Announcement.findBy('id', id)
    if (!announcement) return
    await announcement.delete()
  }
}
