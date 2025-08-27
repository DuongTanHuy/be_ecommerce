import { CategoryTranslationSchema } from 'src/shared/models/shared-category-translation.model'
import z from 'zod'

const GetCategoryTranslationParamsSchema = z.object({
  categoryTranslationId: z.coerce.number().int().positive()
})

const GetCategoryTranslationDetailResSchema = CategoryTranslationSchema

const CreateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
  categoryId: true,
  languageId: true,
  name: true,
  description: true
}).strict()

const UpdateCategoryTranslationBodySchema = CreateCategoryTranslationBodySchema.partial().strict()

type GetCategoryTranslationParamsType = z.infer<typeof GetCategoryTranslationParamsSchema>

type GetCategoryTranslationDetailResType = z.infer<typeof GetCategoryTranslationDetailResSchema>

type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>

type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>

export {
  GetCategoryTranslationParamsSchema,
  GetCategoryTranslationDetailResSchema,
  CreateCategoryTranslationBodySchema,
  UpdateCategoryTranslationBodySchema,
  GetCategoryTranslationParamsType,
  GetCategoryTranslationDetailResType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType
}
