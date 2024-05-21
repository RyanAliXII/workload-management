import env from '#start/env'
import { inject } from '@adonisjs/core'
import { v2 as cloudinaryV2 } from 'cloudinary'
const CLOUD_NAME = env.get('CLOUDINARY_CLOUD_NAME')
export const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/`
cloudinaryV2.config({
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
  cloud_name: CLOUD_NAME,
})
type UploadOptions = { filePath: string; folder?: string }
@inject()
export class CloudinaryService {
  async upload({ filePath, folder = '' }: UploadOptions) {
    const result = await cloudinaryV2.uploader.upload(filePath, {
      unique_filename: true,
      folder: folder,
    })
    return result.public_id
  }
  generatePublicUrl(publicId: string) {
    return cloudinaryV2.url(publicId)
  }
}
