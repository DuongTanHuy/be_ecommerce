import { Injectable } from '@nestjs/common'
import { PresignedUploadFileBodyType } from 'src/routes/media/entities/media.entity'
// import { unlink } from 'fs/promises'
import envConfig from 'src/shared/config'
import { generateRandomFilename } from 'src/shared/helpers'
import S3Service from 'src/shared/services/s3.service'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Array<Express.Multer.File>) {
    const result = await Promise.all(
      files.map((file) => {
        return this.s3Service
          .uploadFile({
            filename: 'images/' + file.filename,
            filepath: file.path,
            contentType: file.mimetype
          })
          .then((res) => ({
            url: res.Location,
            url_local: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`
          }))
          .catch((error) => {
            console.log(error)
            return {
              url_local: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`
            }
          })
      })
    )

    // Delete local file after upload to S3
    // await Promise.all(files.map((file) => unlink(file.path)))

    return {
      data: result
    }
  }

  async getPresignedUrl(body: PresignedUploadFileBodyType) {
    const randomFilename = generateRandomFilename(body.filename)

    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFilename)
    const url = presignedUrl.split('?')[0]

    return {
      presignedUrl,
      url
    }
  }
}
