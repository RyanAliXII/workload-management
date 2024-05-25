import FacultyTaskAttachment from '#models/faculty_task_attachment'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

@inject()
export class FacultyTaskAttachmentRepository {
  async createOrUpdateMany(attachments: { taskId: number; objectName: string }[]) {
    if (attachments.length === 0) return null
    const trx = await db.transaction()
    try {
      await FacultyTaskAttachment.query({ client: trx })
        .where({ task_id: attachments[0].taskId })
        .delete()
      const a = await FacultyTaskAttachment.createMany(attachments, { client: trx })
      trx.commit()
      return a
    } catch (error) {
      trx.rollback()
    }
  }
}
