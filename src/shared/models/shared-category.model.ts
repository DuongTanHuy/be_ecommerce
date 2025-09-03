import { CategoryTranslationSchema } from 'src/shared/models/shared-category-translation.model'
import z from 'zod'

const CategorySchema = z.object({
  id: z.number(),
  parentCategoryId: z.number().nullable(),
  name: z.string(),
  logo: z.string().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

const CategoryIncludeTranslationSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema)
})

type CategoryType = z.infer<typeof CategorySchema>

type CategoryIncludeTranslationType = z.infer<typeof CategoryIncludeTranslationSchema>

export { CategorySchema, CategoryIncludeTranslationSchema, CategoryType, CategoryIncludeTranslationType }
