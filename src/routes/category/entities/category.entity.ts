import { CategoryIncludeTranslationSchema, CategorySchema } from 'src/shared/models/shared-category.model'
import z from 'zod'

const GetAllCategoriesSchema = z.object({
  categories: z.array(CategoryIncludeTranslationSchema),
  total: z.number()
})

const GetAllCategoriesQuerySchema = z.object({
  parentCategoryId: z.coerce.number().int().positive().optional()
})

const GetCategoryParamsSchema = z
  .object({
    categoryId: z.coerce.number().int().positive()
  })
  .strict()

const GetCategoryDetailResSchema = CategoryIncludeTranslationSchema

const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  logo: true,
  parentCategoryId: true
}).strict()

const UpdateCategoryBodySchema = CreateCategoryBodySchema.partial().strict()

type GetAllCategoriesType = z.infer<typeof GetAllCategoriesSchema>

type GetAllCategoriesQueryType = z.infer<typeof GetAllCategoriesQuerySchema>

type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>

type GetCategoryDetailResType = z.infer<typeof GetCategoryDetailResSchema>

type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>

type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>

export {
  GetAllCategoriesSchema,
  GetAllCategoriesQuerySchema,
  GetCategoryParamsSchema,
  GetCategoryDetailResSchema,
  CreateCategoryBodySchema,
  UpdateCategoryBodySchema,
  GetAllCategoriesType,
  GetAllCategoriesQueryType,
  GetCategoryParamsType,
  GetCategoryDetailResType,
  CreateCategoryBodyType,
  UpdateCategoryBodyType
}
