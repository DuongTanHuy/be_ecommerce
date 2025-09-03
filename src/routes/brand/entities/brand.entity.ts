import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation.model'
import { BrandIncludeTranslationSchema, BrandSchema } from 'src/shared/models/shared-brand.model'
import z from 'zod'

const GetBrandQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10)
})

const GetBrandResSchema = z.object({
  brands: z.array(BrandIncludeTranslationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

const GetBrandDetailResSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema)
})

const CreateBrandBodySchema = z
  .object({
    name: z.string(),
    logo: z.string()
  })
  .strict()

const CreateBrandResSchema = BrandIncludeTranslationSchema

const UpdateBrandBodySchema = CreateBrandBodySchema.partial().strict()

const UpdateBrandResSchema = BrandIncludeTranslationSchema

const GetBrandDetailParamsSchema = z
  .object({
    brandId: z.string()
  })
  .strict()

type GetBrandQueryType = z.infer<typeof GetBrandQuerySchema>
type GetBrandResType = z.infer<typeof GetBrandResSchema>
type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>
type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
type CreateBrandResType = z.infer<typeof CreateBrandResSchema>
type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>
type GetBrandDetailParamsType = z.infer<typeof GetBrandDetailParamsSchema>

export {
  GetBrandQuerySchema,
  GetBrandResSchema,
  GetBrandDetailResSchema,
  CreateBrandBodySchema,
  CreateBrandResSchema,
  UpdateBrandBodySchema,
  UpdateBrandResSchema,
  GetBrandDetailParamsSchema,
  GetBrandQueryType,
  GetBrandResType,
  GetBrandDetailResType,
  CreateBrandBodyType,
  CreateBrandResType,
  UpdateBrandResType,
  UpdateBrandBodyType,
  GetBrandDetailParamsType
}
