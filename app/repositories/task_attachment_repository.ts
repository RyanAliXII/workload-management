import TaskAttachment from '#models/task_attachment'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

@inject()
export class TaskAttachmentRepository {
  async createOrUpdateMany(attachments: { taskId: number; objectName: string }[]) {
    if (attachments.length === 0) return null
    const trx = await db.transaction()
    try {
      await TaskAttachment.query({ client: trx }).where({ task_id: attachments[0].taskId }).delete()
      const a = await TaskAttachment.createMany(attachments, { client: trx })
      trx.commit()
      return a
    } catch (error) {
      trx.rollback()
    }
  }
}
