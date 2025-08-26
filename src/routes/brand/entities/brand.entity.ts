import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation.model'
import z from 'zod'

const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

const BrandIncludeTranslationSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema)
})

const GetBrandQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
  })
  .strict()

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

type BrandType = z.infer<typeof BrandSchema>
type BrandIncludeTranslationType = z.infer<typeof BrandIncludeTranslationSchema>
type GetBrandQueryType = z.infer<typeof GetBrandQuerySchema>
type GetBrandResType = z.infer<typeof GetBrandResSchema>
type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>
type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
type CreateBrandResType = z.infer<typeof CreateBrandResSchema>
type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>
type GetBrandDetailParamsType = z.infer<typeof GetBrandDetailParamsSchema>

export {
  BrandSchema,
  GetBrandQuerySchema,
  GetBrandResSchema,
  GetBrandDetailResSchema,
  CreateBrandBodySchema,
  CreateBrandResSchema,
  UpdateBrandBodySchema,
  UpdateBrandResSchema,
  GetBrandDetailParamsSchema,
  BrandType,
  BrandIncludeTranslationType,
  GetBrandQueryType,
  GetBrandResType,
  GetBrandDetailResType,
  CreateBrandBodyType,
  CreateBrandResType,
  UpdateBrandResType,
  UpdateBrandBodyType,
  GetBrandDetailParamsType
}
