import { createZodDto } from 'nestjs-zod'
import {
  PresignedUploadFileBodySchema,
  PresignedUploadFileResSchema,
  UploadFilesResSchema
} from 'src/routes/media/entities/media.entity'

class UploadFilesResDto extends createZodDto(UploadFilesResSchema) {}

class PresignedUploadFileBodyDto extends createZodDto(PresignedUploadFileBodySchema) {}

class PresignedUploadFileResDto extends createZodDto(PresignedUploadFileResSchema) {}

export { UploadFilesResDto, PresignedUploadFileBodyDto, PresignedUploadFileResDto }
