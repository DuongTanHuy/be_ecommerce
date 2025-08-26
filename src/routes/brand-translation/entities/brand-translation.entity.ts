import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation.model'
import z from 'zod'

const GetBrandTranslationDetailParamsSchema = z
  .object({
    brandTranslationId: z.string()
  })
  .strict()

const GetBrandTranslationDetailResSchema = BrandTranslationSchema

const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true
}).strict()

const CreateBrandTranslationResSchema = BrandTranslationSchema

const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema.partial().strict()

type GetBrandTranslationDetailParamsType = z.infer<typeof GetBrandTranslationDetailParamsSchema>

type GetBrandTranslationDetailResType = z.infer<typeof GetBrandTranslationDetailResSchema>

type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>

type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>

type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>

export {
  GetBrandTranslationDetailParamsSchema,
  GetBrandTranslationDetailResSchema,
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationResSchema,
  UpdateBrandTranslationBodySchema,
  GetBrandTranslationDetailParamsType,
  GetBrandTranslationDetailResType,
  CreateBrandTranslationBodyType,
  CreateBrandTranslationResType,
  UpdateBrandTranslationBodyType
}
