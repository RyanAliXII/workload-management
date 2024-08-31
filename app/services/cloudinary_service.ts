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
type ResourceType = 'auto' | 'image' | 'raw' | 'video'

type UploadOptions = {
  filePath: string
  folder?: string
  fileExtension?: string
  resourceType?: ResourceType
}
@inject()
export class CloudinaryService {
  async upload({ filePath, folder = '', resourceType = 'auto', fileExtension }: UploadOptions) {
    console.log(filePath)
    const result = await cloudinaryV2.uploader.upload(filePath, {
      unique_filename: true,
      format: fileExtension,
      folder: folder,
      resource_type: resourceType,
    })
    return result.public_id
  }
  generatePublicUrl(publicId: string) {
    return cloudinaryV2.url(publicId)
  }
  generatePublicUrlAsAttachment(publicId: string, resourceType: ResourceType = 'auto') {
    return cloudinaryV2.url(publicId, {
      flags: 'attachment',
      resource_type: resourceType,
    })
  }
}
