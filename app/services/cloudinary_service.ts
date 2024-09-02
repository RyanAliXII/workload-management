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
  generatePublicUrlAsAttachment(publicId: string) {
    return cloudinaryV2.url(publicId, {
      flags: 'attachment',
      resource_type: detectResourceType(publicId),
    })
  }
}

function detectResourceType(fileName: string): ResourceType {
  const extension = fileName.split('.').pop()?.toLowerCase()
  if (!extension) return 'image'

  switch (extension) {
    // Image extensions
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'tiff':
    case 'webp':
      return 'image'

    // Video extensions
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
    case 'flv':
    case 'wmv':
    case 'webm':
      return 'video'

    // Document extensions (raw type)
    case 'pdf': // PDF
    case 'doc': // Word document
    case 'docx': // Word document
    case 'xls': // Excel spreadsheet
    case 'xlsx': // Excel spreadsheet
    case 'ppt': // PowerPoint
    case 'pptx': // PowerPoint
    case 'txt': // Text file
    case 'rtf': // Rich Text Format
    case 'odt': // OpenDocument Text
    case 'ods': // OpenDocument Spreadsheet
    case 'odp': // OpenDocument Presentation
    case 'csv': // CSV file
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'iso':
      return 'raw'

    // Default case
    default:
      return 'image'
  }
}
