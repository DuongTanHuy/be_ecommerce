import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { MediaService } from './media.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'
import { ParseFilePipeWithUnlink } from 'src/routes/media/parse-file-pipe-with-unlink.pipe'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  PresignedUploadFileBodyDto,
  PresignedUploadFileResDto,
  UploadFilesResDto
} from 'src/routes/media/dto/upload-media.dto'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Post('images/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     limits: {
  //       fileSize: 2 * 1024 * 1024
  //     }
  //   })
  // )
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
  //         new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|gif|bmp|webp)$/ })
  //       ]
  //     })
  //   )
  //   file: Express.Multer.File
  // ) {
  //   console.log(file)
  // }

  @Post('images/upload')
  @ZodSerializerDto(UploadFilesResDto)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
          // new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
        ]
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.mediaService.uploadFile(files)
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      const notFound = new NotFoundException('File not found')

      if (error) {
        res.status(notFound.getStatus()).send(notFound.getResponse())
      }
    })
  }

  @Post('images/upload/presigned-url')
  @ZodSerializerDto(PresignedUploadFileResDto)
  @IsPublic()
  createPreSignedUrl(@Body() body: PresignedUploadFileBodyDto) {
    return this.mediaService.getPresignedUrl(body)
  }
}
