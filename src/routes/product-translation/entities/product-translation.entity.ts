import { ProductTranslationSchema } from 'src/shared/models/shared-product-translation.model'
import z from 'zod'

const GetProductTranslationParamsSchema = z
  .object({
    productTranslationId: z.coerce.number().int().positive()
  })
  .strict()

const GetProductTranslationDetailResSchema = ProductTranslationSchema

const CreateProductTranslationBodySchema = ProductTranslationSchema.pick({
  productId: true,
  name: true,
  description: true,
  languageId: true
}).strict()

const UpdateProductTranslationBodySchema = CreateProductTranslationBodySchema.partial().strict()

type GetProductTranslationParamsType = z.infer<typeof GetProductTranslationParamsSchema>

type GetProductTranslationDetailResType = z.infer<typeof GetProductTranslationDetailResSchema>

type CreateProductTranslationBodyType = z.infer<typeof CreateProductTranslationBodySchema>

type UpdateProductTranslationBodyType = z.infer<typeof UpdateProductTranslationBodySchema>

export {
  GetProductTranslationParamsSchema,
  GetProductTranslationDetailResSchema,
  CreateProductTranslationBodySchema,
  UpdateProductTranslationBodySchema,
  GetProductTranslationParamsType,
  GetProductTranslationDetailResType,
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType
}
