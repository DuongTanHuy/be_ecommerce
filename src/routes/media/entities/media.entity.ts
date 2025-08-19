import z from 'zod'

const UploadFilesResSchema = z.object({
  data: z.array(
    z.object({
      url: z.string().optional(),
      url_local: z.string()
    })
  )
})

const PresignedUploadFileBodySchema = z
  .object({
    filename: z.string(),
    filesize: z.number().max(5 * 1024 * 1024)
  })
  .strict()

const PresignedUploadFileResSchema = z.object({
  presignedUrl: z.string(),
  url: z.string()
})

type UploadFilesResType = z.infer<typeof UploadFilesResSchema>

type PresignedUploadFileBodyType = z.infer<typeof PresignedUploadFileBodySchema>

type PresignedUploadFileResType = z.infer<typeof PresignedUploadFileResSchema>

export {
  UploadFilesResSchema,
  PresignedUploadFileBodySchema,
  PresignedUploadFileResSchema,
  UploadFilesResType,
  PresignedUploadFileBodyType,
  PresignedUploadFileResType
}
