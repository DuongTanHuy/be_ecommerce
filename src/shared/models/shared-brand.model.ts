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

type BrandType = z.infer<typeof BrandSchema>

type BrandIncludeTranslationType = z.infer<typeof BrandIncludeTranslationSchema>

export { BrandSchema, BrandIncludeTranslationSchema, BrandType, BrandIncludeTranslationType }
